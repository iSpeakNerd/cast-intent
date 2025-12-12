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
 * Methods to generate a Warpcast composer intent URL with options,
 * as described in the docs at https://docs.farcaster.xyz/reference/warpcast/cast-composer-intents
 *
 */
export class WarpcastUrlBuilder {
  private static readonly COMPOSER_BASE_URL = 'https://warpcast.com/~/compose';

  /**
   * @param options.text - The text of the cast
   * - max 320 characters for short casts
   * - max 1024 characters for long casts
   *
   * @param options.embeds - The embed URLs to include in the cast
   * - max 2
   * - must be valid URLs
   *
   * @param options.parentCastHash - The parent cast hash for replies,
   * - must be in valid hash format `/^0x[a-fA-F0-9]{40}$/`
   * - overrides `options.channelKey`
   *
   * @param options.channelKey - The name of the channel to cast into
   *
   * @returns The Warpcast intent URL
   */
  static composerUrl(options: WarpcastComposeOptions): string {
    const params = new URLSearchParams();

    if (options.text.length > 1024) {
      throw new Error(
        'Farcaster does not support cast text longer than 1024 characters'
      );
    }
    if (options.text.length > 320) {
      console.warn(
        'This is a long cast. It will show only the first 320 characters on timeline'
      );
    }
    params.append('text', options.text);

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
        throw new Error('Invalid parent cast hash format');
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
