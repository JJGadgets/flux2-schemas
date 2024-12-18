export async function onRequest(context) {
  const vars = context.params.main;
  const apiVersion = vars[0];
  let url = new URL(context.request.url);
  url.pathname = `helmrelease-helm-` + apiVersion + `.json`;
  let valuesFile;
  if (vars[1] === "github") {
    valuesFile = `https://raw.githubusercontent.com/` + vars.slice(2).join('/');
    if (valuesFile.endsWith(".json") === false) {valuesFile += `/values.schema.json`};
  } else {
    valuesFile = vars.slice(1).join('/');
  };
  const upstream = await context.env.ASSETS.fetch(url);
  let schema = JSON.parse(JSON.stringify(await upstream.json()));
  schema.properties.spec.properties.values.$ref = valuesFile;
  return new Response(JSON.stringify(schema), upstream)
}
