import conf from "../conf/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";



export class DataService{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);

    }

    async createPost({title, slug, content, featuredImage, status, userId}){
       try{
        return await this.databases.createDocument(
            conf.appwriteDatabaseID,
            conf.appwriteCollectionID,
            slug,
            {
                title,
                content,
                featuredImage,
                status,
                userId,
            }
        )

       }catch(err){
        console.log(`AppWrite Create Post Error: ${err}`);
       }
    }

    async updatePost(slug,{title,  content, featuredImage, status}){  // I have taken slug out for a reaason
        try{
            return await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        }catch(err){
            console.log(`AppWrite Update Post Error: ${err}`);
        }
    }

    async deletePost(slug){  // Slug is basically acting as our document id in the api.
        try{
            await this.databases.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,

            )
            return true;

        }catch(err){
            console.log(`AppWrite Delete Post Error: ${err}`);
            return false;
        }
    }


    async getPost(slug){
        try{
            return await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug
            )
        }catch(err){
            console.log(`AppWrite Get Post Error: ${err}`);
            return false;
        }
    }

   async getPosts(queries = [Query.equal("status","active")]){   // Passing the appwrite built in queries as the parameter for this function.
    try{
        return await this.databases.listDocuments(
            conf.appwriteDatabaseID,
            conf.appwriteCollectionID,
            queries,
            // Pagination etc can also be added here.
        )
    }catch(err){
        console.log(`AppWrite Get Posts Error: ${err}`);
        return false;
    }
   }



   // File uplodaing methods
   async uploadFile(file){
        try{
            return await this.bucket.createFile(
                conf.appwriteBucketID,
                ID.unique(),
                file
            )

        }catch(err){
            console.log(`AppWrite Upload File Error: ${err}`);
            return false;
        }
   }

   async deleteFile(fileId){
        try{
            await this.bucket.deleteFile(
                conf.appwriteBucketID,
                fileId
            )
            return true;
            
        }catch(err){
            console.log(`AppWrite Delete File Error: ${err}`);
            return false;
        }
   }

   async getFilePreview(fileId){  // There was no need for writing async here because the response of this endpoint is very fast. 
        try{
            await this.bucket.getFilePreview(
                conf.appwriteBucketID,
                fileId
            )
        }catch(err){
            console.log(`AppWrite Get File Preview Error: ${err}`);
            return false;
        }
   }
}


const dataService = new DataService();

export default dataService;