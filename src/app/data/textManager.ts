export class TextManager {
  static cropDescriptionAfter(what: string, where: number): string {
    const realWhere = what.indexOf(' ', where);
    return what.substring(0, realWhere) + '...';
  }
}
