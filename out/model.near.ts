
      import { storage, near, base64 } from "./near";
      import { JSONEncoder } from "./json/encoder";
      import { JSONDecoder, ThrowingJSONHandler, DecoderState } from "./json/decoder";
      import {Item as wrapped_Item} from "./model";

      // Runtime functions
      @external("env", "return_value")
      declare function return_value(value_len: usize, value_ptr: usize): void;
    
export function __near_encode_Item(
          value: wrapped_Item,
          encoder: JSONEncoder): void {
encoder.setInteger("id", value.id);
if (value.author != null) {
            encoder.setString("author", value.author);
          } else {
            encoder.setNull("author");
          }
if (value.name != null) {
            encoder.setString("name", value.name);
          } else {
            encoder.setNull("name");
          }
if (value.description != null) {
            encoder.setString("description", value.description);
          } else {
            encoder.setNull("description");
          }
if (value.imageUrl != null) {
            encoder.setString("imageUrl", value.imageUrl);
          } else {
            encoder.setNull("imageUrl");
          }
}
export class __near_JSONHandler_Item extends ThrowingJSONHandler {
      buffer: Uint8Array;
      decoder: JSONDecoder<__near_JSONHandler_Item>;
      handledRoot: boolean = false;
      value: wrapped_Item;

      constructor(value_: wrapped_Item) {
        super();
        this.value = value_;
      }
      
setInteger(name: string, value: i64): void {
if (name == "id") {
            this.value.id = <i32>value;
            return;
          }

        super.setInteger(name, value);
      }
setString(name: string, value: String): void {
if (name == "author") {
            this.value.author = <String>value;
            return;
          }
if (name == "name") {
            this.value.name = <String>value;
            return;
          }
if (name == "description") {
            this.value.description = <String>value;
            return;
          }
if (name == "imageUrl") {
            this.value.imageUrl = <String>value;
            return;
          }

        super.setString(name, value);
      }
setNull(name: string): void {
if (name == "id") {
        this.value.id = <i32>null;
        return;
      }
if (name == "author") {
        this.value.author = <String>null;
        return;
      }
if (name == "name") {
        this.value.name = <String>null;
        return;
      }
if (name == "description") {
        this.value.description = <String>null;
        return;
      }
if (name == "imageUrl") {
        this.value.imageUrl = <String>null;
        return;
      }

      super.setNull(name);
    }

      pushObject(name: string): bool {
if (!this.handledRoot) {
      assert(name == null);
      this.handledRoot = true;
      return true;
    } else {
      assert(name != null);
    }

        return super.pushObject(name);
      }

      pushArray(name: string): bool {

        return super.pushArray(name);
      }
}

export function __near_decode_Item(
        buffer: Uint8Array, state: DecoderState, value: wrapped_Item = null):wrapped_Item {
      if (value == null) {
        value = new wrapped_Item();
      }
      let handler = new __near_JSONHandler_Item(value);
      handler.buffer = buffer;
      handler.decoder = new JSONDecoder<__near_JSONHandler_Item>(handler);
      handler.decoder.deserialize(buffer, state);
      return value;
    }

export class Item extends wrapped_Item {
        static decode(json: Uint8Array): Item {
          let value = new Item();
          value.decode(json);
          return value;
        }

        decode(json: Uint8Array): Item {
          <Item>__near_decode_Item(json, null, this);
          return this;
        }

        private _encoder(): JSONEncoder {
          let encoder: JSONEncoder = new JSONEncoder();
          encoder.pushObject(null);
          __near_encode_Item(<Item>this, encoder);
          encoder.popObject();
          return encoder;
        }

        encode(): Uint8Array {
          return this._encoder().serialize();
        }

        toString(): string {
          return this._encoder().toString();
        }
      }