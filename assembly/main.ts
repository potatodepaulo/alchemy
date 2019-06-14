import "allocator/arena";
export { memory };

import { context, storage, near, collections } from "./near";
import { Item } from "./model.near";

const RETURN_LIMIT = 20;
const SEPARATOR_CODE = 58;
const CRAFT_NUM_COMPONENTS_LIMIT = 3;

let items = collections.vector<Item>("iv");
let itemsMap = collections.vector<string, i32>("im");

function userItemsVec(accountId: string): collections.Vector<i32> {
  return collections.vector<i32>("uiv:" + accountId);
}

function userItemsMap(accountId: string): collections.Map<i32, i32> {
  return collections.map<i32, i32>("uim:" + accountId);
}


function assertAccountId(accountId: string): void {
  let n = accountId.length;
  assert(n >= 5 && n <= 32, "Account ID length should be between 5 and 32 chars");
  for (let i = 0; i < n; ++i) {
    assert(accountId.charCodeAt(i) != SEPARATOR_CODE, "Can't contain `:`");
  }
}

export function listUserItems(accountId: string, offset: i32): i32[] {
  assertAccountId(accountId);
  assert(offset >= 0);
  let itemIds = userItemsVec(accountId);
  let resLen = min(RETURN_LIMIT, itemIds.length - offset);
  if (resLen <= 0) {
    return [];
  }
  let res = new Array<i32>(resLen);
  for (let i = 0; i < resLen; ++i) {
    res[i] = itemIds[i + offset];
  }
  return res;
}

export function getItem(itemId: i32): Item {
  return items[itemId];
}

export function getItems(itemIds: i32[]): Item[] {
  assert(itemIds.length <= RETURN_LIMIT);
  return itemIds.map(getItem);
}

function assertSortedAndHave(sortedIds: i32[]): void {
  let n = sortedIds.length;
  assert(n >= 2 && n <= CRAFT_NUM_COMPONENTS_LIMIT, "Number of components should be between 2 and CRAFT_NUM_COMPONENTS_LIMIT");
  for (let i = 1; i < n; ++i) {
    assert(sortedIds[i] >= sortedIds[i - 1], "The list of items is unsorted");
  }
  let m = userItemsMap(context.sender);
  sortedIds.forEach((itemId) => {
    assert(m.get(itemId, -1) >= 0, "User doesn't have the item");
  });
}

function hashSortedIds(sortedIds: i32[]): string {
  return near.base58(near.hash(sortedIds.join()));
}

function getItemByHash(hash: string): Item {
  let itemId = itemsMap.get(hash, -1);
  return items.containsIndex(itemId) ? items[itemId] : null;
}

function maybeAddItem(item: Item): void {
  let m = userItemsMap(context.sender);
  // Checking if the user doesn't have the item yet.
  if (m.get(item.itemId, -1) < 0) {
    let itemIds = userItemsVec(context.sender);
    m.set(item.itemId, itemIds.push(item.itemId));
  }
}

// Mixing two-three items
export function craft(sortedIds: i32[]): Item {
  assertSortedAndHave(sortedIds);
  let hash = hashSortedIds(sortedIds);
  let item = getItemByHash(hash);
  if (item) {
    maybeAddItem(item);
  }
  return item;
}

export function invent(sortedIds: i32[], item: Item): Item {
  assertSortedAndHave(sortedIds);
  let hash = hashSortedIds(sortedIds);
  assert(getItemByHash(item) == null, "Given recipe already exists");
  item.itemId = items.length;
  item.author = context.sender;
  itemsMap.set(hash, items.push(item));
  maybeAddItem(item);
  return item;
}