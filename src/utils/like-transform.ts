export const getLikeCount = (map: Map<string, string>, type: string) => {
  let count = 0;
  map.forEach((like) => {
    if (like === type) count++;
  });
  return count;
};

export const getCurrentStatus = (map: Map<string, string>, userId: string) => {
  return map.get(userId) || "None";
};
