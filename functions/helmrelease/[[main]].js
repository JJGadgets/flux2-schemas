export async function onRequest(context) {
  const vars = context.params.main;
  const apiVersion = vars[0];
  const urlParams = new URLSearchParams(context.url)
  let url = new URL(context.request.url);
  url.pathname = `helmrelease-helm-` + apiVersion + `.json`;
  let valuesFile;
  function jsonAppend() {
    if (valuesFile.pathname.endsWith(".json") === false) {valuesFile.pathname += `/values.schema.json`};
  }
  if (vars[1] === "github") {
    valuesFile = new URL(`https://raw.githubusercontent.com/` + vars.slice(2).join('/'));
    jsonAppend();
  } else if (vars.length >= 1) { if (vars[1].startsWith("https") === false) {
    valuesFile = new URL(`https://` + vars.slice(1).join('/'));
    jsonAppend();
  }} else {
    valuesFile = new URL(urlParams.url);
  };
  const upstream = await context.env.ASSETS.fetch(url);
  let schema = JSON.parse(JSON.stringify(await upstream.json()));
  schema.properties.spec.properties.values.$ref = valuesFile.toString();
  return new Response(JSON.stringify(schema), upstream)
}
