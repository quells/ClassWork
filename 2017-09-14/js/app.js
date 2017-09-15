var Employee = function(json) {
    this.name = json.name;
    this.role = json.role;
    this.startDate = moment(json.startDate);
    this.startDateParsed = this.startDate.format("MM/DD/YYYY");
    this.monthsWorked = moment().diff(this.startDate, "month");
    this.monthlyRate = json.monthlyRate;
    this.totalBilled = this.monthsWorked * this.monthlyRate;
};

function EmployeeHeaders() {
    var tableHeader = $("#employees-headers");
    var headers = ["Employee Name", "Role", "Start Date", "Months Worked", "Monthly Rate ($)", "Total Billed ($)"];
    headers.forEach(function(h) {
        $("<th>").text(h).appendTo(tableHeader);
    });
};

function DisplayEmployee(e, key) {
    var id = key;
    var row = $("<tr>").attr("id", id);
    var attrs = ["name", "role", "startDateParsed", "monthsWorked", "monthlyRate", "totalBilled"];
    attrs.forEach(function(a) {
        $("<td>").text(e[a]).appendTo(row);
    });
    row.appendTo($("#employees-body"));
};

function ResetInputDate() {
    $("#newEmployeeStartDate").val(moment().format("YYYY-MM-DD"));
};

function ResetInputs() {
    $("#newEmployeeName").val("");
    $("#newEmployeeRole").val("");
    ResetInputDate();
    $("#newEmployeeRate").val(0);
};

$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAlMeVGz3W7VKVNPv1ddg19WM633ZXFrdg",
        authDomain: "employeedatabase-crustacean.firebaseapp.com",
        databaseURL: "https://employeedatabase-crustacean.firebaseio.com",
        projectId: "employeedatabase-crustacean",
        storageBucket: "",
        messagingSenderId: "294448060103"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    EmployeeHeaders();
    ResetInputs();
    for (key in employees) {
        var e = employees[key];
        DisplayEmployee(e, key);
    }

    $("#resetStartDate").click(ResetInputDate);

    $("#addNewEmployee").click(function(e) {
        e.preventDefault();
        var name = $("#newEmployeeName").val().trim();
        var role = $("#newEmployeeRole").val().trim();
        var startDate = $("#newEmployeeStartDate").val().trim();
        var monthlyRate = $("#newEmployeeRate").val().trim();

        if (name.length > 0 && role.length > 0 && startDate.split("-").length === 3 && monthlyRate.length > 0) {
            // Process input
            // if (startDate[2] > moment().format("YY")) {
            //     // Y2K bug waiting to happen
            //     startDate[2] = "19" + startDate[2];
            // } else {
            //     startDate[2] = "20" + startDate[2];
            // }
            // startDate = startDate[2] + "-" + startDate[0] + "-" + startDate[1];
            monthlyRate = Math.floor(monthlyRate);

            var employee = {
                "name": name,
                "role": role,
                "startDate": startDate,
                "monthlyRate": monthlyRate
            };
            // Push to database
            var key = database.ref().child("employees").push(employee).key;
            // Save local copy
            employees[key] = new Employee(employee);

            ResetInputs();
        }
    });

    database.ref("employees").on("value", function(snapshot) {
        var values = snapshot.val();
        for (key in values) {
            // Update local variable
            if (employees[key] === undefined) {
                employees[key] = new Employee(values[key]);
                DisplayEmployee(employees[key], key);
            }
        }
        for (key in employees) {
            // Clear out values deleted on server
            if (values[key] === undefined) {
                delete employees[key];
                $("#" + key).remove();
            }
        }
        // try {
        //     // Update local storage
        //     localStorage.setItem("employees", JSON.stringify(employees));
        // } catch (e) {
        //     console.log(e);
        // }
    })
});
