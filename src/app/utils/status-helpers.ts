export class StatusHelpers {

  static getAssetBadgeClass(status: number): string {
    switch (status) {
      case 1: return 'badge-success';
      case 2: return 'badge-info';
      case 3: return 'badge-warning';
      case 4: return 'badge-neutral';
      case 5: return 'badge-danger';
      case 6: return 'badge-neutral';
      default: return '';
    }
  }
}
