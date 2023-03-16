import {
  addPriorityObject,
  deletePriorityObject,
  gePriorityObject, //   updatePriorityObject,
} from "@/services/social.service";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const PRIORITY_OBJECT = "@PRIORITY_OBJECT";

export const usePriorityObjectList = (filter: any) => {
  return useQuery([PRIORITY_OBJECT, filter], () => gePriorityObject(filter));
};

export const useMutationPriorityObject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, ...data }: any) => {
      if (action === "delete") {
        return deletePriorityObject(data.id);
      }

      //   if (action === "update") {
      //     return updatePriorityObject(data._id, data);
      //   }

      if (action === "add") {
        return addPriorityObject(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PRIORITY_OBJECT);
        message.success({
          content: "Thành công!",
          key: PRIORITY_OBJECT,
        });
      },
      onError: () => {
        message.error({
          content: "Tài khoản đã tồn tại!",
          key: PRIORITY_OBJECT,
        });
      },
    },
  );
};
