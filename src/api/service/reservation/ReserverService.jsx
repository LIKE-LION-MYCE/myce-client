import instance from "../../lib/axios";

export const saveReservers = async (reservationId, reserverInfos) => {
  await instance.post("/reservers", {
    reservationId,
    reserverInfos,
  });
};
