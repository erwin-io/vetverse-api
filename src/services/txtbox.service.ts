import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as FormData from "form-data";
import axios from "axios";

@Injectable()
export class TxtboxService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService
  ) {}
  async sendOTP(number, otp) {
    const data = new FormData();
    data.append("message", `Your OTP ${otp}`);
    data.append("number", number.toString());

    const url = this.config.get<string>("TXTBOX_OTP_URI").toString();
    const apiKey = this.config.get<string>("TXTBOX_APIKEY").toString();
    const config = {
      method: "post",
      url: url,
      headers: {
        "X-TXTBOX-Auth": apiKey,
        Cookie: "cross-site-cookie=bar",
        ...data.getHeaders(),
      },
      data: data,
    };

    await axios(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
      });
  }
}
