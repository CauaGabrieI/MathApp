import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('Android back closes the lesson, returns to subjects, then allows exit',()=>{
 const source=fs.readFileSync('android/app/src/main/java/br/com/equacao/app/MainActivity.java','utf8');
 const method=source.slice(source.indexOf('private void handleBack()'),source.indexOf('@Override protected void onPause()'));
 const expression=method.match(/evaluateJavascript\((".*?"),handled->/s);
 assert.ok(expression,'Android back exposes the WebView navigation expression');
 const script=JSON.parse(expression[1]);
 let open=true;
 const context={location:{hash:'#mapa/materia/stage.math'},document:{querySelectorAll:()=>open?[{close(){open=false;}}]:[]}};
 assert.equal(vm.runInNewContext(script,context),true);
 assert.equal(open,false);
 assert.equal(context.location.hash,'#mapa/materia/stage.math');
 assert.equal(vm.runInNewContext(script,context),true);
 assert.equal(context.location.hash,'#mapa');
 assert.equal(vm.runInNewContext(script,context),false);
});
