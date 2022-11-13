// const { connection } = require("../config/database");
/*jshint multistr: true */
var mysql = require("mysql");
var dbconfig = require("../config/database");
var connection = mysql.createConnection(dbconfig.connection);
var bcrypt = require("bcrypt-nodejs");
const multer = require("multer") 
var fs=require('fs')
const express = require('express')
const path=require('path')
const app=express()
connection.query("USE " + dbconfig.database);
const uuid = require('uuid');
app.use(express.static('public'))
// app/routes.js
app.use(multer)
var uuidname=uuid.v1();
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/imgs')
	},
	filename: function(req, file, callback) {
		callback(null, uuidname + '-' + file.originalname + path.extname(file.originalname))
	}
})
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
//       cb(null, true);
//   } else {
//       cb(null, false);
//   }
// }
// const upload = multer({ storage: storage, fileFilter: fileFilter });


module.exports = function (app, passport) {
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  // app.get('/', function (req, res) {
  // 	res.redirect('/login'); // load the index.ejs file
  // });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get("/login", function (req, res) {
    // if (isLoggedIn()){
    // 	res.redirect('/home');
    // }

    // render the page and pass in any flash data if it exists
    res.render("./Employees/login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
    function (req, res) {
      console.log("hello");

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect("/login");
    }
  );



  // app.get("/patlogin", function (req, res) {
  //   // if (isLoggedIn()){
  //   // 	res.redirect('/home');
  //   // }

  //   // render the page and pass in any flash data if it exists
  //   res.render("patlogin.ejs", { message: req.flash("loginMessage") });
  // });


  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function (req, res) {
  	// render the page and pass in any flash data if it exists
  	res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  //process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
  	successRedirect: '/home', // redirect to the secure profile section
  	failureRedirect: '/signup', // redirect back to the signup page if there is an error
  	failureFlash: true // allow flash messages
  }));

  // =====================================
  // PROFILE SECTION =========================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get("/", isLoggedIn, function (req, res) {
    var query =
      "SELECT employee.emp_id, employee.emp_name, employee.contact, employee.address, employee.dob\
		, login.username FROM employee inner join login on employee.login_id=login.login_id WHERE employee.login_id = ?";
    // console.log(req.user.login_id)
    // console.log(req.user);
    connection.query(query, [req.user.login_id], function (err, rows) {
      if (err) {
        console.log(err);
      }
      // console.log(rows)
      if(req.user.role!='Patient'){
      res.render("./Employees/index.ejs", {
        user: req.user,
        rows: rows,
      });
    }
    else if(req.user.role==='Patient'){
      res.redirect('/pathome');
    }
    else{res.redirect('login')}
  });})
  
  
  app.post("/updateDetails", function (req, res) {
    var emp_id = req.body.empId;
    var old_username = req.user.username;
    console.log(req.user.username);
    var emp_username = req.body.empUsername;
    var emp_contact = req.body.empContact;
    var emp_address = req.body.empAddress;
    // console.log(emp_id);
    // console.log(emp_username);
    // console.log(emp_contact);
    // console.log(emp_address);
    if (req.body.empUsername) {
      var query1 = "UPDATE login SET username=? WHERE username=?";
      connection.query(query1, [emp_username, old_username], function (
        err,
        rows
      ) {
        if (err) {
          console.log(err);
        }
      });
    }
    if (req.body.empContact) {
      var query2 = "UPDATE employee SET contact=? WHERE emp_id=?";
      connection.query(query2, [emp_contact, emp_id], function (err, rows) {
        if (err) {
          console.log(err);
        }
      });
    }
    if (req.body.empAddress) {
      var query2 = "UPDATE employee SET address=? WHERE emp_id=?";
      connection.query(query2, [emp_address, emp_id], function (err, rows) {
        if (err) {
          console.log(err);
        }
      });
    }
    res.redirect("/");
  });

  app.get("/manageUsers", isLoggedIn,function (req, res) {
    var query1 = 
      "SELECT employee.emp_id, employee.emp_name, employee.contact, employee.address, \
         login.role,login.username FROM employee INNER JOIN login \
		ON employee.login_id=login.login_id ORDER BY employee.emp_id";
    var role=req.user.role;
    console.log(role)
    if(role==='Admin')
    {
    connection.query(query1, function (err, rows) {
      res.render("./Employees/manage_users.ejs", {
        user: req.user,
        rows: rows,
        message: "",
      });
    });
    // res.render('manage_users.ejs',{user: req.user});
  }
else{
res.render('./Employees/error.ejs',{user:req.user
})
}});

  app.post("/addUser", function (req, res) {
    var empName = req.body.emp_name;
    var empContact = req.body.emp_contact;
    var empDOB = req.body.emp_DOB;
    var empAddress = req.body.emp_address;
    var empUsername = req.body.emp_username;
//    var empPassword = bcrypt.hashSync(req.body.emp_pass, null, null);
    var empPassword = req.body.emp_pass;
    var empRole = req.body.emp_role;
    console.log(req.body.login_id);
// var query='SELECT role FROM login where login_id= '
//     console.log(query);
    var queryToCheckUsername = "SELECT * FROM login WHERE username = ?";
    connection.query(queryToCheckUsername, [empUsername], function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        if (rows.length) {
          res.render("./Employees/manage_users.ejs", {
            user: req.user,
            rows: rows,
            message: "Username already taken!",
          });
        } else {
          var queryToAddEmpCredentials =
          "INSERT INTO login (username, password, role) VALUES (?, ?, ?)";
          
          var queryToAddEmployee =
            "INSERT INTO employee (emp_name, contact, address, dob, login_id) \
					VALUES (?, ?, ?, ?, ?)";
          connection.query(
            queryToAddEmpCredentials,
            [empUsername, empPassword, empRole],
            function (err, rows) {
              if (err) {
                console.log(err);
              }
              console.log(
                "Successfully entered login credentials of the employee"
              );
              console.log(rows);
              connection.query(
                queryToAddEmployee,
                [empName, empContact, empAddress, empDOB, rows.insertId],
                function (err, rows) {
                  if (err) {
                    console.log(err);
                  }
                  console.log("Successfully inserted an employee");
                }
              );
            }
          );
          res.redirect("/manageUsers");
        }
      }
    });
  });

  app.post("/deleteEmployee", function (req, res) {
    var empId = req.body.checkbox;
    console.log(empId);
    var query1 =
      "SELECT login.username \
		FROM login INNER JOIN employee \
		ON employee.login_id=login.login_id AND employee.emp_id = ?";

    connection.query(query1, [empId], function (err, rows) {
      var empUsername = rows[0].username;
      //console.log(rows[0].username);

        var Emprem="delete employee,login from employee INNER join login on employee.login_id=login.login_id where login.username=?";
        connection.query(Emprem,[empUsername],function(err,rows){
          if(err){console.log(err);}
          res.redirect("/manageUsers");
        })
      //   var queryToRemoveCred = "DELETE FROM login WHERE username = ?";
      //   connection.query(queryToRemoveCred, [empUsername], function (err, rows) {
      //     if (err) {
      //       console.log(err);
      //     }
      // });
      console.log(empUsername);

    });
  });
  // console.log(empUsername);

  app.get("/createBill", isLoggedIn, function (req, res) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    // document.write(today);
    var query1 =
      "SELECT medicine.med_id, medicine.med_name, medicine.mrp, inventory.stock_id, \
		DATE_FORMAT(inventory.expiry_date,'%m-%d-%Y') AS expiry_date, \
		inventory.total_number, drug_manufacturer.name FROM \
		((medicine INNER JOIN inventory ON medicine.med_id=inventory.med_id) INNER JOIN \
		drug_manufacturer ON medicine.company_id=drug_manufacturer.company_id) ORDER BY medicine.med_id";
    connection.query(query1, function (err, rows) {
      // res.render('create_bill.ejs', {user: req.user, rows: rows, rows1: rows1});
      // console.log(rows)
      var query2 =
        "SELECT patient_1.pat_id, patient_1.pat_name, patient_1.age, doctor_1.doc_name FROM \
			((patient_1 INNER JOIN patient_2 ON patient_1.pat_id = patient_2.pat_id) \
			INNER JOIN doctor_1 ON patient_2.doc_id=doctor_1.doc_id) ORDER BY patient_1.pat_id";
      connection.query(query2, function (err, rows2) {
        connection.query(
          "SELECT MAX(bill_no) AS bill_no FROM bill_1",
          function (err, bills) {
            res.render("./Employees/create_bill.ejs", {
              user: req.user,
              rows: rows,
              rows2: rows2,
              today: today,
              bills: bills,
            });
          }
        );
      });
    });
    // res.render('create_bill.ejs', {user: req.user});
  });

  app.post("/generateBill", function (req, res) {
    var patientId = req.body.patId;
    var billDate = req.body.billDate;
    var paymentMode = req.body.paymentMode;
    var discount = req.body.discount;
    var finalCost = req.body.finalTotalCost;
    var medIds = [];
    var medQuantity = [];
    var medStockIds = [];
    var i = 0;
    while (req.body["medId" + i]) {
      // var idNo = 'medId'+i;
      medIds.push(req.body["medId" + i]);
      medQuantity.push(req.body["medQuantity" + i]);
      medStockIds.push(req.body["medStockId" + i]);
      ++i;
    }
    console.log(medIds);
    console.log(medQuantity);
    console.log(medStockIds);
    console.log(patientId);
    console.log(billDate);
    console.log(paymentMode);
    console.log(discount);
    console.log(finalCost);
    var query1 =
      "INSERT INTO bill_1 (payment_mode, discount, pat_id, total_cost, bill_date)\
		VALUES (?,?,?,?,?)";
    var billNo;
    connection.query(
      query1,
      [paymentMode, discount, patientId, finalCost, billDate],
      function (err, rows) {
        if (err) {
          console.log(err);
        }
        console.log(rows)
        billNo = rows.insertId;
        var query2 =
          "INSERT INTO bill_2 (bill_no, quantity, med_id) VALUES \
			(?,?,?)";
        for (let index = 0; index < medIds.length; index++) {
          connection.query(
            query2,
            [billNo, medQuantity[index], medIds[index]],
            function (err, rows2) {
              if (err) {
                console.log(err);
              }
              console.log("Number of records inserted: " + rows2.affectedRows);
            }
          );
        }
      }
    );
    for (var i = 0; i < medIds.length; ++i) {
      var query3 =
        "UPDATE inventory SET total_number=total_number - ? WHERE stock_id = ?";
      connection.query(query3, [medQuantity[i], medStockIds[i]], function (
        err,
        rows3
      ) {
        if (err) {
          console.log(err);
        }
        console.log("Rows affected:", rows3.affectedRows);
      });
    }
    res.redirect("/invoiceHistory");
  });

  app.get("/patients", isLoggedIn, function (req, res) {
    var query1 =
      "SELECT patient_1.pat_id, patient_1.pat_name, patient_1.contact, patient_1.address, patient_1.gender, \
			patient_1.age, doctor_1.doc_name \
			FROM ((patient_1 INNER JOIN patient_2 ON patient_1.pat_id=patient_2.pat_id) \
			INNER JOIN doctor_1 ON patient_2.doc_id=doctor_1.doc_id)\
			ORDER BY patient_1.pat_id";
    connection.query(query1, function (err, rows) {
      const query2 = "SELECT doc_id, doc_name FROM doctor_1";
      connection.query(query2, function (err, rows2) {
        res.render("./Employees/patient_details.ejs", {
          user: req.user,
          rows: rows,
          rows2: rows2,
          message: "",
        });
      });
    });
    // res.render('patient_details.ejs', {user: req.user});
  });

  app.post("/addPatient", function (req, res) {
    var patName = req.body.patient_name;
    var patContact = req.body.patient_contact;
    var patAddress = req.body.patient_address;
    var patGender = req.body.patient_gender;
    var patAge = req.body.patient_age;
    var patInsuranceId = req.body.patient_insurance_id;
    var patDoc = req.body.patient_doctor;
    var patPassword=req.body.patient_password;
    
    var lid='select login_id from login where username=? and password=?';
    connection.query(lid,[patName,patPassword],function(err,rows4){
      // console.log(rows4);
      if(err){console.log(err);}
      else
      if(rows4.length){
        console.log(rows4);
        res.redirect('/patients')
      }
      else
   { var query3="Insert into login (username,password,role) values \
    (?,?,?)";
    connection.query(query3,[patName,patPassword,'Patient'],function(
      err,rows3
    ){
      if(err){
        console.log(err);
      }
    
    
    var newloginid=[]
    var lid='select login_id from login where username=? and password=?';
    connection.query(lid,[patName,patPassword],function(err,rows4){
      if(err){
        console.log(err);
      }
      // setlogin(rows4[0].login_id);
      newloginid=rows4[0].login_id
      console.log(newloginid);
      var query =
      "INSERT INTO patient_1 (pat_name, contact, gender, insurance_id, age, address,pat_id) VALUES \
      (?,?,?,?,?,?,?)";
      
      connection.query(
        query,
        [patName, patContact, patGender, patInsuranceId, patAge, patAddress,newloginid],
        function (err, rows) {
          if (err) {
            console.log(err);
          }
          var query2 = "INSERT INTO patient_2 VALUES (?,?)";
          connection.query(query2, [rows.insertId, patDoc], function (
            err,
            rows2
          )
       {
            if (err) {
              console.log(err);
            }
  
            res.redirect("/patients");
          });
        }
      );
  
    });
    }
    )}
  })
  })
   

  app.get("/doctors", isLoggedIn, function (req, res) {
    var query = "SELECT doc_name, contact, specialization FROM doctor_1";
    connection.query(query, function (err, rows) {
      res.render("./Employees/doctor_details.ejs", { user: req.user, rows: rows });
    });
    // res.render("doctor_details.ejs", {user: req.user});
  });

  app.post("/addDoctor", function (req, res) {
    var docName = req.body.doctor_name;
    var docContact = req.body.doctor_contact;
    var docSpecialization = req.body.doctor_specialization;

    var check="select doc_id, doc_name,contact,specialization from doctor_1 where doc_name=? and contact=?";
    connection.query(check,[docName,docContact],function(err,rows1){
      if(err){
        console.log(err);
      }
      else{
        if(rows1.length)
        {
         res.render('./Employees/doctor_details.ejs',{
          user: req.user,
          rows: rows1,
          message: req.flash('docmsg',"Doctor already exists!"),
        })
        }
        else{
            var query =
        "INSERT INTO doctor_1 (doc_name, contact, specialization) VALUES (?,?,?)";
      connection.query(query, [docName, docContact, docSpecialization], function (err,rows) {
        if (err) {
          console.log(err);
        }
        res.redirect("/doctors");
    });
        }
      }
    })
    
  });

  // app.get("/error",isLoggedIn,function(req,res){
  //   res.render('error.ejs',{
  //     user:req.user
  //   })
  // })
  app.get("/inventory", isLoggedIn, function (req, res) {
    var query =
      "SELECT medicine.med_id, medicine.med_name, medicine.mrp, medicine.primary_drug, \
		drug_manufacturer.name \
		FROM medicine \
		INNER JOIN drug_manufacturer ON medicine.company_id=drug_manufacturer.company_id ORDER BY medicine.med_id";
    connection.query(query, function (err, rows) {
      var query1 =
        "select inventory.stock_id, medicine.med_id, DATE_FORMAT(inventory.expiry_date,'%d-%m-%Y') AS expiry_date, \
			inventory.total_number\
			from inventory INNER JOIN \
			medicine ON inventory.med_id=medicine.med_id ORDER BY medicine.med_id;";
      connection.query(query1, function (err, rows1) {
        var query3 =
          "SELECT employee.emp_name, employee.emp_id, login.role \
				FROM employee inner join login ON employee.login_id=login.login_id";
        connection.query(query3, function (err, rows2) {
          var query4 = "select * from drug_manufacturer";
          connection.query(query4, function (err, rows3) {
            res.render("./Employees/inventory.ejs", {
              user: req.user,
              rows: rows,
              rows1: rows1,
              rows2: rows2,
              rows3: rows3,
            });
          });
        });
      });
      // res.render('inventory.ejs', {user: req.user, rows: rows});
    });
    // res.render("inventory.ejs", {user: req.user});
  });

  app.post("/addStock", function (req, res) {
    var medId = req.body.med_id;
    var expiryDate = req.body.expiry_date;
    var totalStock = req.body.total_stock;
    var associatedEmpId = req.body.associated_emp_id;
    console.log(medId);
    console.log(expiryDate);
    console.log(totalStock);
    console.log(associatedEmpId);
    var query =
      "INSERT INTO inventory (med_id, expiry_date, total_number, emp_id) \
		VALUES (?,?,?,?)";
    connection.query(
      query,
      [medId, expiryDate, totalStock, associatedEmpId],
      function (err, rows) {
        if (err) {
          console.log(err);
        }
        res.redirect("/inventory");
      }
    );
  });

  app.post("/addMedicine", function (req, res) {
    var medName = req.body.new_med_name;
    var medMRP = req.body.new_med_mrp;
    var primaryDrug = req.body.primary_drug;
    var dosage = req.body.dosage;
    var companyId = req.body.company_id;
    var query =
      "INSERT INTO medicine (med_name, mrp, primary_drug, dosage, company_id) \
		VALUES (?,?,?,?,?)";
    connection.query(
      query,
      [medName, medMRP, primaryDrug, dosage, companyId],
      function (err, rows) {
        if (err) {
          console.log(err);
        }
        res.redirect("/inventory");
      }
    );
  });

 
  app.get("/invoiceHistory", isLoggedIn, function (req, res) {
    var query =
      "SELECT bill_1.bill_no, bill_1.payment_mode, bill_1.discount, bill_1.total_cost, \
		DATE_FORMAT(bill_1.bill_date,'%d-%m-%Y') AS bill_date, patient_1.pat_name\
		 FROM bill_1 INNER JOIN patient_1 ON bill_1.pat_id=patient_1.pat_id ORDER BY bill_1.bill_date DESC";
    connection.query(query, function (err, rows) {
      res.render("./Employees/invoice_history.ejs", { user: req.user, rows: rows });
    });
  });



  app.get("/billNo:billId", isLoggedIn, function (req, res) {
    var billId = req.params.billId;
    var query =
      "SELECT \
		bill_1.bill_no, bill_1.payment_mode, bill_1.discount, bill_1.total_cost, \
		DATE_FORMAT(bill_1.bill_date,'%Y-%m-%d') AS bill_date, patient_1.pat_name, \
		patient_1.pat_id, patient_1.age, bill_2.quantity, medicine.med_name, \
		medicine.mrp FROM bill_1 INNER JOIN patient_1 ON bill_1.pat_id=patient_1.pat_id \
		INNER JOIN bill_2 ON bill_1.bill_no=bill_2.bill_no \
		INNER JOIN medicine ON bill_2.med_id=medicine.med_id WHERE bill_1.bill_no = ?";
    // var query = "SELECT bill_1.bill_no, bill_1.payment_mode, bill_1.discount, bill_1.total_cost, \
    // DATE_FORMAT(bill_1.bill_date,\'%d-%m-%Y\') AS bill_date, patient_1.pat_name, bill_2.quantity, medicine.med_name\
    // ((FROM bill_1 INNER JOIN patient_1 ON bill_1.pat_id=patient_1.pat_id) \
    // INNER JOIN bill_2 ON bill_1.bill_no=bill_2.bill_no) WHERE bill_1.bill_no = ?";
    // var query1 = "SELECT * FROM bill_1 INNER JOIN bill_2 ON bill_1.bill_no=bill_2.bill_no";

    connection.query(query, [billId], function (err, rows) {
      if (err) {
        console.log(err);
      }
      console.log(rows);
      res.render("./Employees/billDetails.ejs", { user: req.user, rows: rows });
    });
  });



  app.get('/AllRequests',isLoggedIn,function(req,res){
    app.use(express.static('public'))
    var query="select Status,message_id,imgsrc,message,\
    DATE_FORMAT(message.date,'%y-%m-%d %h:%m:%s') AS date, \
    patient_1.pat_name,patient_1.contact \
     from message inner join patient_1 on patient_1.pat_id=message.pat_id";
    connection.query(query,function(err,rows){
      if(err){
        console.log(err);
      }
      console.log(rows);
      res.render('./Employees/patientMessages.ejs',{user:req.user,rows:rows})
    })
  })
 
  app.get("/messageNo:message_id", isLoggedIn, function (req, res) {
    var messageId = req.params.message_id;
    console.log(messageId);
    var query =
      "select Status,message_id,message,imgsrc,\
      DATE_FORMAT(message.date,'%y-%m-%d %h:%m:%s') AS date, \
      patient_1.pat_name,patient_1.contact \
       from message inner join patient_1 on patient_1.pat_id=message.pat_id where message_id=?";
    connection.query(query, [messageId], function (err, rows) {
      if (err) {
        console.log(err);
      }
      res.render("./Employees/messageDetails.ejs", { user: req.user, rows: rows });
      console.log(rows);
    });
  });


  app.post('/changeStatus',isLoggedIn,function(req,res){
    var status=req.body.Status;
    var messageid=req.body.MessageId;
    console.log(messageid);
    console.log(req.body);
    var query="UPDATE message SET Status=? WHERE message_id=?";
    connection.query(query,[status,messageid],function(err,rows){
      if(err) {console.log(err);}
      console.log(rows);
    })
    res.redirect('/AllRequests')
  })
// =============================
// PATIENTS SECTION
//==============================

app.post("/patlogin",
passport.authenticate("local-login", {
  successRedirect: "/", // redirect to the secure profile section
  failureRedirect: "/patlogin", // redirect back to the signup page if there is an error
  failureFlash: true, // allow flash messages
}),
function (req, res) {
  console.log("hello");

  if (req.body.remember) {
    req.session.cookie.maxAge = 1000 * 60 * 3;
  } else {
    req.session.cookie.expires = false;
  }
  res.redirect("/patlogin");
}
);

app.get("/patinvoice", isLoggedIn, function (req, res) {
  var billId = req.params.billId;
  // var query =
  //   "SELECT bill_1.bill_no, bill_1.payment_mode, bill_1.discount, bill_1.total_cost, \
  // DATE_FORMAT(bill_1.bill_date,'%d-%m-%Y') AS bill_date\
  //  FROM bill_1 INNER JOIN patient_1 ON bill_1.pat_id=patient_1.pat_id\ where patient_1.pat_name=? ORDER BY bill_1.bill_date DESC";
  var query="SELECT( bill_1.bill_no), bill_1.payment_mode,medicine.med_name,bill_2.quantity, bill_1.discount, bill_1.total_cost, \
  DATE_FORMAT(bill_1.bill_date,'%d-%m-%Y') AS bill_date FROM bill_1 \
  INNER JOIN patient_1 ON bill_1.pat_id=patient_1.pat_id inner join bill_2 on bill_2.bill_no=bill_1.bill_no\
  inner join medicine on medicine.med_id=bill_2.med_id \ where patient_1.pat_name=? group by bill_no"
  connection.query(query,[req.user.username], function (err, rows) {
    var temp=req.user.username;
    console.log(temp)
    res.render("./Patients/patinvoice_history.ejs", { user: req.user, rows: rows });
  });
});

app.get("/Pat_billNo:billId", isLoggedIn, function (req, res) {
  var billId = req.params.billId;
  var query =
    "SELECT \
  bill_1.bill_no, bill_1.payment_mode, bill_1.discount, bill_1.total_cost, \
  DATE_FORMAT(bill_1.bill_date,'%Y-%m-%d') AS bill_date, patient_1.pat_name, \
  patient_1.pat_id, patient_1.age, bill_2.quantity, medicine.med_name, \
  medicine.mrp FROM bill_1 INNER JOIN patient_1 ON bill_1.pat_id=patient_1.pat_id \
  INNER JOIN bill_2 ON bill_1.bill_no=bill_2.bill_no \
  INNER JOIN medicine ON bill_2.med_id=medicine.med_id WHERE bill_1.bill_no = ?";
  // var query = "SELECT bill_1.bill_no, bill_1.payment_mode, bill_1.discount, bill_1.total_cost, \
  // DATE_FORMAT(bill_1.bill_date,\'%d-%m-%Y\') AS bill_date, patient_1.pat_name, bill_2.quantity, medicine.med_name\
  // ((FROM bill_1 INNER JOIN patient_1 ON bill_1.pat_id=patient_1.pat_id) \
  // INNER JOIN bill_2 ON bill_1.bill_no=bill_2.bill_no) WHERE bill_1.bill_no = ?";
  // var query1 = "SELECT * FROM bill_1 INNER JOIN bill_2 ON bill_1.bill_no=bill_2.bill_no";

  connection.query(query, [billId], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.render("./Patients/patbillDetails.ejs", { user: req.user, rows: rows });
  });
});

app.get('/PatRequest',isLoggedIn,function(req,res){
 if(req.user.role==='Patient')
  { var query="select message,date,Status from message inner join patient_1 on message.pat_id=patient_1.pat_id \
   where patient_1.login_id=?";
  //  console.log(req.user.login_id);
   var temp=req.user.login_id;
   console.log(temp);
   connection.query(query,[temp],function (err,rows) {
     if(err){
       console.log(err);
     }
    //  console.log(rows);
    //  console.log(temp+'ok');
     res.render("./Patients/patRequest.ejs", { user: req.user, rows: rows });
   });}
   else{
     res.redirect('/logout')
   }
  // res.render("./Patients/patRequest.ejs",{user:req.user,rows:null})
  // console.log(req);
})

app.get("/pathome",isLoggedIn,function(req,res){
  var query="select * from patient_1 inner join login on patient_1.login_id=login.login_id where patient_1.pat_name=? and login.password=?"
  console.log(req.user)
  connection.query(query,[req.user.username, req.user.password],function(err,rows){
    if(err){
      console.log(err);
    }
    console.log(req.user.role);
    if(req.user.role==='Patient'){
      res.render("./Patients/patindex.ejs", {
        user: req.user,
        rows: rows,
      });
    }
    
  })
})

app.post("/addRequest",function(req,res){
  app.use(express.static('public'))
  if(req.user.role==='Patient')
  {var temp=req.user.login_id;
    var upload = multer({
      storage: storage,
      fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname)
        // if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext!=='.jfif') {
        //   return callback(res.end('Only images are allowed'), null)
        // }
        console.log(file);
        var fileloc=process.env.IMGDIR+'/'+uuidname+'-'+file.originalname+ext
        // var fileloc=path.join(process.env.BASE,process.env.SUBDIR
        //   ,process.env.SUBDIRR,process.env.DESKTOP,process.env.DIR,process.env.IMGDIR,uuidname+file.originalname)
        console.log(fileloc);
        callback(null, true)
        var query="select pat_id from patient_1 where patient_1.login_id = ?";
        connection.query(query,[temp],function(err,rows){
          // console.log(req);
          // console.log(req.body);
          // console.log(req.body.messageText);
          // console.log(rows[0].pat_id)
          var pid=rows[0].pat_id
          console.log(pid);
          if(err){
            console.log(err);
          }
          var message=req.body.messageText;
          // console.log(pid);
          // console.log(message);
          // res.redirect('/patRequest')
          var query2= "insert into message (pat_id,message,imgsrc) values(?,?,?)";
          connection.query(query2,[pid,message,fileloc],function(err,rows0){
            if(err)
            {console.log(err);}
          }
          )

          res.redirect('/patRequest')
        })
      }
    }).single('image');
    upload(req, res, function(err) {
      res.end('File is uploaded')
    })
    // console.log(req.files);
    // var file = req.body.image;
    // console.log(file);
    // console.log(req);
    // if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
    //   var imageName = file;
    //   var uuidname = uuid.v1();
    //   console.log(imageName);
    //   console.log(uuidname);
    //   // file.mv('public/images/' + uuidname + file)
    // }
    // var uuidname=uuid.v1();
    // var fileloc='../imgs/'+uuidname+file;
    // fs.writeFile(fileloc)
  // var query="select pat_id from patient_1 where patient_1.login_id = ?";
  // connection.query(query,[temp],function(err,rows){
  //   // console.log(req);
  //   // console.log(req.body);
  //   // console.log(req.body.messageText);
  //   // console.log(rows[0].pat_id)
  //   var pid=rows[0].pat_id
  //   if(err){
  //     console.log(err);
  //   }
  //   var message=req.body.messageText;
  //   // console.log(pid);
  //   // console.log(message);
  //   // res.redirect('/patRequest')
  //   var query2= "insert into message (pat_id,message) values(?,?)";
  //   connection.query(query2,[pid,message],function(err){
  //     if(err)
  //     {console.log(err);}
  //   }
  //   )

  //   res.redirect('/patRequest')
  // })}
  }
  else{
    res.redirect('/logout')
  }
})

app.get('/patmedicine',function(req,res){
  var query="SELECT( bill_1.bill_no), bill_1.payment_mode,medicine.med_name,bill_2.quantity, bill_1.discount, bill_1.total_cost, \
  DATE_FORMAT(bill_1.bill_date,'%d-%m-%Y') AS bill_date FROM bill_1 \
  INNER JOIN patient_1 ON bill_1.pat_id=patient_1.pat_id inner join bill_2 on bill_2.bill_no=bill_1.bill_no\
  inner join medicine on medicine.med_id=bill_2.med_id \ where patient_1.pat_name=? ";

  connection.query(query,[req.user.username],function(err,rows)
  {
    if(err) console.log(err);
    res.render('./Patients/patmedicine.ejs',{user:req.user,rows:rows})
  })
})

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get("/logout", function (req, res) {
    req.logout();
    req.session.destroy();
    // setTimeout(function(){ window.location = "../views/login.ejs"; },3000);
    res.redirect("/");
  });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    // res.redirect('/home');
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect("/login");
}
