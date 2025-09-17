export function checkRuleExists(
  filePath: string,
  rule: string,
  rules: any
) {
  if (!(rules as any)['rules']) {
    console.info(`${filePath}: rules expected`);
    return false;
  }

  if (!(rules as any)['rules'][rule]) {
    console.info(`${filePath}: ${rule} expected`);
    return false;
  }

  if ((rules as any)['rules'][rule]['length'] < 2) {
    console.info(`${filePath}: ${rule}.1 unexpected`);
    return false;
  }

  if (!(rules as any)['rules'][rule][1]['depConstraints']) {
    console.info(`${filePath}: ${rule}.1.depConstraints expected.`);
    return false;
  }

  if (!Array.isArray((rules as any)['rules'][rule][1]['depConstraints'])) {
    console.info(
      `${filePath}: ${rule}.1.depConstraints expected to be an array.`
    );
    return false;
  }

  return true;
}
