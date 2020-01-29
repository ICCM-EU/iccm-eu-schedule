export class TextManager {
  static cropDescriptionAfter(what: string, where: number): string {
    const realWhere = what.indexOf(' ', where);
    let out = what.substring(0, realWhere);
    if (out.length !== what.length) {
      out = out + '...';
    }
    return out;
  }
}
