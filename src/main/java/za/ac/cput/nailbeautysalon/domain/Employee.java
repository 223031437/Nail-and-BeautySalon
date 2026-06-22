package za.ac.cput.nailbeautysalon.domain;


import jakarta.persistence.*;


@Entity
public class Employee extends User{
    private String employeeId;
    private String role;

    protected Employee() {}

    public Employee(Builder builder) {
        this.userId = builder.userId;
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.email = builder.email;
        this.cellNumber = builder.cellNumber;
        this.employeeId = builder.employeeId;
        this.role = builder.role;

    }
    public String getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getCellNumber() {
        return cellNumber;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public String getRole() {
        return role;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "employeeId=" + employeeId +
                ", role=" + role +
                ", userId=" + userId +
                ", lastName=" + lastName +
                ", firstName=" + firstName +
                ", email=" + email +
                ", cellNumber=" + cellNumber +
                '}';
    }

    public static class Builder{
        private String userId;
        private String firstName;
        private String lastName;
        private String email;
        private String cellNumber;
        private String employeeId;
        private String role;

        public Builder setUserId(String userId) {
            this.userId = userId;
            return this;
        }

        public Builder setFirstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public Builder setLastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setCellNumber(String cellNumber) {
            this.cellNumber = cellNumber;
            return this;
        }

        public Builder setEmployeeId(String employeeId) {
            this.employeeId = employeeId;
            return this;
        }

        public Builder setRole(String role) {
            this.role = role;
            return this;
        }

        public Builder copy(Employee employee){
            this.userId = employee.userId;
            this.firstName = employee.firstName;
            this.lastName = employee.lastName;
            this.email = employee.email;
            this.cellNumber = employee.cellNumber;
            this.employeeId = employee.employeeId;
            this.role = employee.role;
            return this;
        }

        public Employee build(){ return new Employee(this);}
    }

}
