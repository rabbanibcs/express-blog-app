const mongoose = require('mongoose');
class db{
    constructor(databaseUrl,dbName){
        this.databaseUrl=databaseUrl
        this.options={
            dbName:dbName
        }

    }
    connect(){
        mongoose.connect(this.databaseUrl,this.options).then(()=>{
            console.log('Mongodb is connected.');
        }).catch((err)=>{
            console.log('Could not connect DB.');
            console.log(err);
        })
    }
}





module.exports=db;
// module.exports=connectDb;

