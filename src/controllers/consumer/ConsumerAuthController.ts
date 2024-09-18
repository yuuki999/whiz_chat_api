import { Post, Route, Tags, Body, Security } from "tsoa";
import { AuthResponse, AuthVerifyResponse, LoginRequest, RefreshTokenRequest, RegisterRequest } from "../../types/auth";
import { ConsumerAuthService } from "../../services/consumer/AuthService";
import express from 'express';
import { AuthenticationException } from "../../exception/AuthenticationException";

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

  @Post("verify-access-token")
  @Security("bearer")
  async verifyAccessToken(request: express.Request): Promise<AuthVerifyResponse> {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationException('Invalid authorization header');
    }
    const accessToken = authHeader.split(' ')[1];
    return await this.authService.verifyAccessToken(accessToken);
  }
}
