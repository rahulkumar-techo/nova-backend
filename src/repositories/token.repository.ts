import redis from "@/configs/redis-client";
import refreshTokenModel from "../models/token/refresh-token.model";

interface IHandleRefreshTokenParams {
  oldRefreshToken?: string;
  userId: string;
  refreshTTL: number;
  refreshToken: string;
}

class TokenRepository {


  async handleRefreshToken({
    oldRefreshToken,
    userId,
    refreshTTL,
    refreshToken
  }: IHandleRefreshTokenParams) {

    // Delete old token from Redis + DB
    const deleteOps: Promise<any>[] = [];

    if (oldRefreshToken) {
      deleteOps.push(redis.del(`refresh:${oldRefreshToken}`));
      deleteOps.push(refreshTokenModel.findOneAndDelete({ userId }));
    }

    await Promise.all(deleteOps);

    // Store new token into Redis + DB
    await Promise.all([
      redis.set(`refresh:${refreshToken}`, userId, "EX", refreshTTL),
      refreshTokenModel.create({ userId, token: refreshToken ,expiresAt:refreshTTL})
    ]);
  }

  async findOne (token:string):Promise<any>{
    return await refreshTokenModel.findOne({ token: token });
  }

  async findById (id:string):Promise<any>{
    return await refreshTokenModel.findOne({_id:id });
  }

}

export default new TokenRepository();
