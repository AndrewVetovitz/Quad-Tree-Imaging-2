// https://vike.dev/Head

// header tags
export default function HeadDefault() {
  return (
    <>
      {/* <!--Meta tags--> */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="description" content="Quad Tree Image manipulation to create " />
      <meta name="og:description" content="Andrew Vetovitz Personal Site" />

      <link rel="preconnect" href="https://res.cloudinary.com/" crossOrigin="anonymous" />

      {/* <!--Icon--> */}
      <link
        rel="shortcut icon"
        type="image/x-icon"
        href="https://res.cloudinary.com/dg25vxfyl/image/upload/w_32,h_32,q_20/v1515015610/website-logo_ruxkwy.png"
      />
    </>
  );
}
