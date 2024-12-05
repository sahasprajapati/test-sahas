export const GetArticle = async () => {
  const res = await fetch(`https://test-payload3.trtglobal.tech/api/article`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    // throw new Error('Failed to fetch data')
  }
  console.log(res);
  return res.json();
}
