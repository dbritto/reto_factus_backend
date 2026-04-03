import { UserEmail } from "../../value-objects/user-email.vo.js";
import { UserPassword } from "../../value-objects/user-password.vo.js";
import { UserRole } from "../../enums/user-role.enum.js";

export interface UserProps {
    id?: string;
    name: string;
    email: string;
    roles?: string[]; // Opcional, por defecto será un array vacío
    password: string;
}

export class User {
    public readonly id: string | undefined;
    public readonly name: string;
    private readonly roles: string[]; // Ejemplo: ["admin", "user"]
    public readonly email: UserEmail;
    private readonly password: UserPassword

    constructor(props: UserProps) {
        this.id = props.id;
        this.name = props.name;
        this.email = new UserEmail(props.email);
        this.roles = props.roles ? [...props.roles] : [UserRole.USER]; // Si no se proporcionan roles, asignamos "user" por defecto
        this.password = new UserPassword(props.password);
    }

    // REGLA DE NEGOCIO: ¿Tiene este rol?
    public hasRole(role: UserRole): boolean {
        return this.roles.includes(role);
    }

    // REGLA DE NEGOCIO: ¿Es administrador?
    public isAdmin(): boolean {
        return this.hasRole(UserRole.ADMIN);
    }

    public getRoles(): UserRole[] {
        return this.roles.map(role => role as UserRole);
    }

    public getPasswordValue(): string {
        return this.password.getValue();
    }

}