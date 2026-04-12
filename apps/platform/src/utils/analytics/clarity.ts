export default () => {
  const isProd = (process.env.NODE_ENV || import.meta.env.MODE) === 'production'
  const clarityId = process.env.MICROSOFT_CLARITY_ID || import.meta.env.VITE_MICROSOFT_CLARITY_ID

  if (!isProd || !clarityId) return []

  return [
    {
      type: 'text/javascript',
      children: `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `,
      id: 'ms-clarity-init',
    },
  ]
}
