import { HttpError } from "http-errors";

export class UserNotFound extends HttpError {
    constructor(){
        super(404,`user not found.`)
    }
}

export class UserAlreadyExist extends HttpError {
    constructor(userId){
        super(404,`user with email '${email}' already exist.`)
    }
}


export class invalidCredentials extends HttpError {
    constructor(userId){
        super(404,`Invalid credentails.`)
    }
}