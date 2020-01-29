export class TextManager {
  static cropDescriptionAfter(what: string, where: number): string {
    if (where <= what.length) {
      let realWhere = what.indexOf(' ', where);
      if (realWhere <= where) {
        realWhere = where;
      }
      let out = what.substring(0, realWhere);
      if (out.length !== what.length) {
        out = out + '...';
      }
      return out;
    } else {
      return what;
    }
  }
}
