import {Role, User} from "./components/user";

/**
 * Represents a utility class.
 */
class Utility {
    static isAdmin(user: User): boolean {
        return user.role === Role.ADMIN;
    }

    static isCommonUser(user: User): boolean {
        return user.role === Role.COMMONUSER;
    }

}

export { Utility };
