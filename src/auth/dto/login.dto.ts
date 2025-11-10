import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Por favor, insira um email válido' })
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  password: string;
}