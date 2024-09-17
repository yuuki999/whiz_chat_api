import { Post, Route, Tags, Body } from "tsoa";
import { ConsumerAuthService } from '../../services/consumer/authService';
import { AuthenticationException } from "../../exception/AuthenticationException";
import { AuthResponse, LoginRequest, RefreshTokenRequest, RegisterRequest } from "../../types/auth";

@Route("auth")
@Tags("Authentication")
export class ConsumerAuthController {
  private authService: ConsumerAuthService;

  constructor(authService: ConsumerAuthService) {
    this.authService = authService;
  }

  @Post("login")
  async login(@Body() requestBody: LoginRequest): Promise<AuthResponse> {
    const { email, password } = requestBody;
    return await this.authService.login(email, password);
  }

  @Post("register")
  async register(@Body() requestBody: RegisterRequest): Promise<AuthResponse> {
    return await this.authService.register(requestBody);
  }

  @Post("logout")
  async logout(): Promise<{ message: string }> {
    return { message: "Logged out successfully" };
  }

  @Post("refresh-token")
  async refreshToken(@Body() requestBody: RefreshTokenRequest): Promise<AuthResponse> {
    const { refreshToken } = requestBody;
    return await this.authService.refreshToken(refreshToken);
  }
}
