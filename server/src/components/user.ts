import exp from "node:constants";

/**
 * Represents a user in the system.
 */
class User{
    username:string;
    role:Role;
    mail:string;

    /**
     * @param username usernma of the user, it is unique
     * @param role role of the user it must he or an Admin or a common user
     * @param mail mail of the user
     * */

    constructor(username:string,role:Role,mail:string){
        this.username = username;
        this.role = role;
        this.mail = mail;
    }


}


/**
 * Represents the role of a user.
 * The values present in this enum are the only valid values for the role of a user.
 */
enum Role {
    ADMIN = 'Admin',
    COMMONUSER = 'User',
}

export {Role, User};