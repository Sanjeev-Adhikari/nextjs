import connectDB from "./db/dbConection"
import { User } from "./models/userModel"
import bcrypt from "bcryptjs"

export const adminSeeder = async()=>{
    // find if admin already exists in database
await connectDB();
    const adminExists = await User.findOne( {
        email : "logolabnepal@gmail.com",
    })

    if(!adminExists){
        await User.create({
            email : "logolabnepal@gmail.com",
            password: bcrypt.hashSync("Logolab@123", 10),
            name: "logolab",
            role: "admin"
        })

        console.log("admin seeded successfully")
    }else{
        console.log("admin seeded already!")
    }

}