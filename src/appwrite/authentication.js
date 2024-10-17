import conf from "../conf/config";
import { Client, Account, ID } from "appwrite";

export class AuthService{
    client = new Client();
    account;  // Why have we not initialized using the new keyword here only?

    constructor(){
        this.client
        .setEndpoint(conf.appwriteURL)
        .setProject(conf.appwriteProjectID);

        // Now initializing the account
        this.account = new Account(this.client);

    }

    // Solution for the vendor lockin problem
    async createAccount({email, password, name}){
        try{
            const userAccount = await this.account.create(ID.unique(),email, password, name);
            if(userAccount){
                // Call another method
                // Basically we will try to call the login method here if the userAccount has been created successfully.
                return this.login({email,password});
                
            }else{
                return  userAccount;
            }
        }catch(err){
            throw err;
        }
    }

    async login({email, password}){
        try{
            return await this.account.createEmailPasswordSession(email, password);
        }catch(err){
            throw err;
        }
    }

    async logout(){
        try{
            await this.account.deleteSessions();
        }catch(err){
            throw err;
        }
    }

    async getCurrentUser(){
        try{
            await this.account.get();
        }catch(err){
            throw err;
        }


        return null;  // If nothing happens then null will be returned.
    }

}


// exporting an objext of this class
const authService = new AuthService();

export default authService;