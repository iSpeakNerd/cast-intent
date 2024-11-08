import validator from 'validator';
const isUrl = validator.isURL;

interface WarpcastComposeOptions {
  text: string;
  embeds?: string[];
  parentCastHash?: string;
  channelKey?: string;
}

const hashPattern = /^0x[a-fA-F0-9]{40}$/; // regex pattern for hash validation


 /**
   * Methods to generate a Warpcast composer URL with the given options,
   * docs at https://docs.farcaster.xyz/reference/warpcast/cast-composer-intents
   * 
   */
export class WarpcastUrlBuilder {
  private static readonly COMPOSER_BASE_URL = 'https://warpcast.com/~/compose';

  /**
   * @param options.text - The text of the post
   *
   * @param options.embeds - The embeds to include in the post (max 2)
   *
   * @param options.parentCastHash - The parent cast hash for replies,
   * `/^0x[a-fA-F0-9]{40}$/`,
   * overrides `options.channelKey`
   *
   * @param options.channelKey - The name of the channel to post to
   *
   * @returns The composer URL
   */
  static composerUrl(options: WarpcastComposeOptions): string {
    const params = new URLSearchParams();

    params.append('text', encodeURIComponent(options.text));

    if (options.embeds?.length) {
      if (options.embeds?.length > 2) {
        throw new Error('Warpcast does not support more than 2 embeds');
      }
      options.embeds.forEach((embed) => {
        if (
          !isUrl(embed, {
            require_protocol: true,
            protocols: ['http', 'https'],
          })
        ) {
          throw new Error('Embed strings must be valid URLs');
        }
        return params.append('embeds[]', embed);
      });
    }

    if (options.channelKey) {
      params.append('channelKey', options.channelKey);
    }

    if (options.parentCastHash) {
      if (!hashPattern.test(options.parentCastHash)) {
        throw new Error('Invalid parent cast hash');
      }
      params.append('parentCastHash', options.parentCastHash);
    }

    return `${this.COMPOSER_BASE_URL}?${params.toString()}`;
  }

  /**
   * @param fid - The fid of the user
   *
   * @returns The profile URL
   */
  static profileUrl(fid: number): string {
    return `https://warpcast.com/~/profiles/${fid.toString()}`;
  }

  /**
   * @param hash - The hash of the cast, `/^0x[a-fA-F0-9]{40}$/`
   *
   * @returns The warpcast conversation URL
   */
  static castUrlByHash(hash: string): string {
    if (!hashPattern.test(hash)) {
      throw new Error('Invalid cast hash');
    }
    return `https://warpcast.com/~/conversations/${hash}`;
  }
}