export async function onRequest(context) {
  const vars = context.params.main;
  const apiVersion = vars[0];
  var valuesFile;
  if (vars[1] = "github") {
    valuesFile = `https://raw.githubusercontent.com/` + vars.slice(2).join('/');
    if (valuesFile.endsWith(".json") = false) {valuesFile = valuesFile + `/values.schema.json`};
  } else {
    valuesFile = vars.slice(1).join('/');
  };
  var schema = JSON.parse(await env.ASSETS.fetch(`helmrelease-helm-` + apiVersion + `.json`));
  schema.properties.spec.properties.values.$ref = valuesFile;
  return new Response(JSON.stringify(schema))
}
