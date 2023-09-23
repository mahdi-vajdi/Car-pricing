import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
