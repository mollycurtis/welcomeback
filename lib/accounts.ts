export interface Account {
  id: string;
  name: string;
}

export interface AccountTileSpec extends Account {
  locked?: boolean;
}

export const ACCOUNTS: Account[] = [{ id: 'owner', name: 'Owner' }];

export const MOM_ACCOUNT: AccountTileSpec = { id: 'mom', name: 'Mom', locked: true };

export function visibleAccounts(foundMom: boolean): AccountTileSpec[] {
  return foundMom ? [...ACCOUNTS, MOM_ACCOUNT] : [...ACCOUNTS];
}

export function accountName(id: string): string {
  return ACCOUNTS.find((a) => a.id === id)?.name ?? 'Owner';
}
