import { User } from "../../../src/domain/entities/usuario/user.entity.js";
import { UserEmail } from "../../../src/domain/value-objects/user-email.vo.js";
import { UserPassword } from "../../../src/domain/value-objects/user-password.vo.js";
import { UserRole } from "../../../src/domain/enums/user-role.enum.js";
import { InvalidEmailException, WeakPasswordException } from "../../../src/domain/exceptions/user.exceptions.js";
import { describe, it, expect } from "@jest/globals";

describe("User Entity", () => {

    it('deberia crear un usuario con email y password válidos', () => {
        // 1 - Arrange
        const userProps = {
            name: "John Doe",
            email: "user@example.com",
            password: "Password123"
        };

        // 2 - Act
        const user = new User(userProps);

        // 3 - Assert
        expect(user.name).toBe(userProps.name);
        expect(user.email.getValue()).toBe(userProps.email);
        expect(user.getPasswordValue()).toBe(userProps.password);
        expect(user.getRoles()).toEqual([UserRole.USER]);
    });

    // Test 2: Probando reglas de negocio: hasRole e isAdmin
    it('deberia asignar el rol "admin" y verificarlo correctamente', () => {
        // 1 - Arrange
        const userProps = {
            name: "Admin User",
            email: "admin@example.com",
            password: "AdminPass123",
            roles: [UserRole.ADMIN]
        };

        // 2 - Act
        const adminUser = new User(userProps);

        // 3 - Assert
        expect(adminUser.hasRole(UserRole.ADMIN)).toBe(true);
        expect(adminUser.isAdmin()).toBe(true);
        expect(adminUser.getRoles()).toEqual([UserRole.ADMIN]);
    });

    it('deberia asignar el rol "user" por defecto si no se proporcionan roles', () => {
        // 1 - Arrange
        const userProps = {
            name: "Default User",
            email: "default@example.com",
            password: "DefaultPass123"
        };

        // 2 - Act
        const defaultUser = new User(userProps);

        // 3 - Assert
        expect(defaultUser.getRoles()).toEqual([UserRole.USER]);


    });

    // Test 3: Validación de email y contraseña
    it('deberia lanzar una excepción si el email no es válido', () => {
        // 1 - Arrange
        const userProps = {
            name: "Invalid Email User",
            email: "invalid-email",
            password: "ValidPass123"
        };
        
        // 2 - Act & Assert
        expect(() => new User(userProps)).toThrow(InvalidEmailException);
        expect(() => new User(userProps)).toThrow("El formato del email 'invalid-email' no es válido.");
    });

    it('deberia lanzar una excepción si la contraseña es débil', () => {
        // 1 - Arrange
        const userProps = {
            name: "Weak Password User",
            email: "weakpassword@example.com",
            password: "123"
        };

        // 2 - Act & Assert
        expect(() => new User(userProps)).toThrow(WeakPasswordException);
        expect(() => new User(userProps)).toThrow("La contraseña es demasiado débil. Debe tener al menos 8 caracteres, una mayúscula y un número.");
    });

    it('deberia lanzar una excepción si el email está vacío', () => {
        // 1 - Arrange
        const userProps = {
            name: "Valid User",
            email: "",
            password: "ValidPass123"
        };

        // 2 - Act & Assert
        expect(() => new User(userProps)).toThrow(InvalidEmailException);
        expect(() => new User(userProps)).toThrow("El formato del email '' no es válido.");
    });

    it('deberia lanzar una excepción si la contraseña está vacía', () => {
        // 1 - Arrange
        const userProps = {
            name: "Valid User",
            email: "validemail@example.com",
            password: ""
        };

        // 2 - Act & Assert
        expect(() => new User(userProps)).toThrow(WeakPasswordException);
        expect(() => new User(userProps)).toThrow("La contraseña es demasiado débil. Debe tener al menos 8 caracteres, una mayúscula y un número.");
    });

});