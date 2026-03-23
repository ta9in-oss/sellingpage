export const seo = ({
  title,
  description = "حبة ستور والكل يتسوق في راحتو. عس مليح ، واشري اللي تحتاج برك.",
  image,
  keywords = "7aba store, shopping, تسوق, تصويل مجاني, 58 ولاية , حقائب مدرسية , دخول مدرسي, 2025",
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
}) => {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    // { name: "twitter:creator", content: "@AgoraPulsePi" },
    // { name: "twitter:site", content: "@AgoraPulsePi" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { property: "og:image", content: image },
        ]
      : []),
  ];

  return tags;
};
