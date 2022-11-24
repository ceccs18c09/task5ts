import express from 'express';

import mysql from 'mysql2';

const app:express.Application = express();

const port: number = 5000;

app.use(express.json());
app.use(express.urlencoded());


app.use("/", (req:express.Request, res:express.Response, next) => {
    const auth :any= req.headers.authorization;
    const credentials = Buffer.from(auth.split(" ")[1], "base64")
        .toString("ascii")
        .split(":");

    if (credentials[0] === "super" && credentials[1] === "super") {
        next();
    } else {
        res.status(401).send({ "Message": "Uauthorized user" });
    }
})





var db:any=mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'Anjana@123',
    database: 'task3'

})



db.connect((err:Error) => {

    if (!err) {

        console.log("Connected to mysql");
    }

    else {

        console.log("Not connected");
    }
})



//Get all Employee..

    app.get('/api/employee/', (req:express.Request, res:express.Response) => {
try{
        let sql:string = `Select * from emp`;
        db.query(sql, (err:Error, result:object) => {
            if (err) {
                res.status(500).send({ "Message": "Internal Server Error" });
                console.log("error: " + err);
            }
            else {

                //  console.log(result)
                res.send(result);
            }



        })
   }
catch (err) {
    res.status(500).send({ "Message": "Internal Server Error" });

}
    });

//Delete a employee
app.delete('/api/employee/:id', (req:express.Request, res:express.Response) => {
    try{

    
    const id:string = req.params.id;


    let sql1:string = `Select id,name,age from emp where id=(?)`;
    //  let sql2=`Select id from emp where id=(?)`;
    let sql:string = `Delete from emp where id=(?)`;
    // console.log
    // db.query(sql2,id,(error,ans)){
    //     if(error)

    db.query(sql1, id, (err:Error, result:object) => {

        if (err) {
            res.status(500).send({ "Message": "Internal Server Error" });
            console.log("error: " + err);
        }
        else {
            console.log(result);

            if (Object.keys(result).length== 0) {
                res.status(404).send({ "Message": "Given id is not found" });
            }
            else {
                db.query(sql, id, (er:Error, rese:Object) => {
                    if (er) {
                        res.status(500).send({ "Message": "Internal Server Error" });

                        console.log("error: " + er);
                    }
                    else {
                        res.send(result);

                    }


                });
            }
        }

    }
    );
    }
    
        catch (error) {
            res.status(500).send({ "Message": "Internal Server Error" });
    }
}
);

//Get employee of particular id
app.get('/api/employee/:id', (req:express.Request, res:express.Response) => {
    try{

    const id:string = req.params.id;
    let sql:string = `Select * from emp where  ${id}=id`;
    db.query(sql, (err:Error, result:object) => {
        if (err) {
            res.status(500).send({ "Message": "Internal Server Error:" + err });
        }

        else {
            if (Object.keys(result).length!= 0) {
                res.send(result);
            }
            else {
                res.status(404).send({ "Message": "Given Id is not a valid" });
            }

        }




    })
}
catch (err){
    res.status(500).send({ "Message": "Internal Server Error" }); 
}
}
);



//Get Distinct employee
app.get('/api/distinct/', (req:express.Request, res:express.Response) => {
try{
    let sql = `SELECT DISTINCT Name FROM emp`;
    db.query(sql, (err:Error, result:object) => {

        if (err) {

            res.send("Error:" + err);
        }
        else {

            res.send(result);
        }


    });
}

catch (err) {

    res.status(500).send({ "Message": "Internal Server Error" });
}


});



//create a new employee


app.post('/api/employee/', (req:express.Request, res:express.Response) => {

   
    let employee = req.body;


    // age parameter

    const word:string[] = employee.name.split(' '); console.log(word[0]);
    console.log(word[1]);
    console.log(word[2]);

    if (employee.age < 18 || employee.age > 100) {
        res.status(412).send({ "Message": "Age must be between 18 and 100" });

    }


    else if (word[0].length < 5) {

        res.status(412).send({ "Message": "Minimum length of first name is atleast 5" });

        // res.send("fname")

    }




    else if (word[1] == undefined) {

        res.status(412).send({ "Message": "Last name is mandatory" });

    }


    else {

        if (employee.name && employee.age) {
            let sql = `INSERT INTO emp ( Name, age) VALUES (?,?)`;
            db.query(sql, [employee.name, employee.age], (err:Error, result:object) => {
                if (err) {
                    console.log("hello0");
                    res.status(500).send({ "Message": "Internal Server Error" });
                }
                else {



                    let sql1 = `SELECT Id FROM emp WHERE name=? AND age=?`
                    console.log("hello1");
                    db.query(sql1, [employee.name, employee.age], (err:Error  , rese:object) => {
                        if (err) {
                            console.log("hello2");
                            res.send(err)
                        }
                        else {
                            console.log("hello3");
                            res.send(rese);
                        }
                    });


                    //res.send(result);

                }
            })
        }
        else {
            res.status(400).send({ "Message": "Bad Request" });
           // console.log("error:);
        }


    }

});

//Alter name && age

app.put('/api/employee/:id', (req:express.Request, res:express.Response) => {
    try{
    console.log("hello0");
    const id = req.params.id;
    const employee = req.body;
    let sql2 = `Select id from emp where id=(?)`;
    db.query(sql2, id, (error:Error, result1:object) => {
        if (Object.keys(result1).length== 0) {
            res.status(404).send({ "Message": "Given Id is not  valid" });
        }

        else {

            if (employee.name && employee.age) {


                const word = employee.name.split(" ");
                if (employee.age < 18 || employee.age > 100) {

                    res.status(412).send({ "Message": "Age must be between 18 and 100" });
                }

                else if (word[0].length < 5) {

                    res.status(412).send({ "Message": "Minimum length of first name is atleast 5" });

                    // res.send("fname")

                }




                else if (word[1] == undefined) {

                    res.status(412).send({ "Message": "Last name is mandatory" });

                }


                else {


                    let sql = `UPDATE emp
       SET Name = ?,
        Age = ?
         Where Id = ?`

                    let data = [employee.name, employee.age, id];
                    console.log("hello1")
                    db.query(sql, data, (err:Error, result:object) => {

                        if (err) {
                            console.log("hello2");
                            console.log("error:" + err);
                            //res.send(err);
                            res.status(500).send({ "Message": "Internal Server Error" });
                        }
                        else {
                            console.log("hello3");
                            //  res.send(result);
                            let sql1 = `SELECT * FROM emp WHERE id=?`;
                            db.query(sql1, id, (er:Error, resu:object) => {

                                if (!er)
                                    res.send(resu);

                            });
                        }
                    });

                }
            }

            else if (employee.name) {
                const word = employee.name.split(" ");

                if (word[0].length < 5) {

                    res.status(412).send({ "Message": "Minimum length of first name is atleast 5" });

                    // res.send("fname")

                }




                else if (word[1] == undefined) {

                    res.status(412).send({ "Message": "Last name is mandatory" });

                }


                else {

                    let sql = `UPDATE emp
SET Name = ?
  Where Id = ?`;

                    let data = [employee.name, id];
                    db.query(sql, data, (err:Error , result:object) => {
                        if (err) {
                            console.log("hello2");
                            console.log("error:" + err);
                            res.send(err);
                        }
                        else {
                            console.log("hello3");
                            //  res.send(result);
                            let sql1 = `SELECT * FROM emp where Id = ?`;
                            db.query(sql1, id, (er:Error, resu:object) => {

                                if (!er)
                                    res.send(resu);

                            });
                        }
                    });
                }


            }


            else {



                if (employee.age < 18 || employee.age > 100) {
                    res.status(412).send({ "Message": "Age must be between 18 and 100" });
                }
                else {

                    let sql = `UPDATE emp
SET age = ?
  Where Id = ?`;

                    let data = [employee.age, id];
                    db.query(sql, data, (err:Error, result:object) => {

                        if (err) {
                            console.log("hello2");
                            console.log("error:" + err);
                            // res.send(err);
                            res.status(500).send({ "Message": "Internal Server Error" });
                        }
                        else {
                            console.log("hello3");
                            //res.send(result);
                            let sql1 = `SELECT * FROM emp where id = ?`;
                            db.query(sql1, id, (er:Error, resu:object) => {

                                if (!er)
                                    res.send(resu);

                            });
                        }
                    })



                }
            }
        }
    });
}
catch (err){
    res.status(500).send({ "Message": "Internal Server Error" });
}
});




















app.listen(port, ()=>{
    console.log("Listen on port:http://localhost/5000");
})