 import { getAUserWithUserNameDB } from "../../module/users/service";

const generateUserName = async (name: string):Promise<string> => {
  const isAvailable = await getAUserWithUserNameDB({ userName: name });
  if (!isAvailable) {
    return name;
  } else {
   return generateUserName(name + Math.floor(Math.random() * 999) + 1);
  }
};
 
export default generateUserName