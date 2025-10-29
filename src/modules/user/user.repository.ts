// src/modules/user/user.repository.ts
// Description: Optimized MongoDB repository for updating user profiles quickly

import { UserModel } from "./user.model";

export type IUserProfile = {
    fullname: string;
    avatar: {
        secure_url: string;
        public_id: string;
    };
    userId: string;
};

class UserRepository {
    async findByIdAndUpdateUserProfile({ fullname, avatar, userId }: IUserProfile) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { $set: { fullname, avatar } },
                {
                    new: true,
                    projection: { _id: 1, fullname: 1, avatar: 1 },
                    lean: true,
                }
            );
            if (!updatedUser) {
                throw new Error("User not found or update failed");
            }
            // send updated data to controller
            return updatedUser;
        } catch (error: any) {
            throw new Error(`User update failed: ${error.message}`);
        }
    }
    async findOneUser({ userId }: { userId: string }):Promise<any> {
        try {
            const user = await UserModel.findOne({ _id: userId });
            if (!user) {
                throw new Error("Failed to find user");
            }
            return user
        } catch (error: any) {
            throw new Error(`User update failed: ${error.message}`);
        }
    }
}
export default new UserRepository();
