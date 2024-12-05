# cast-intent

WarpcastUrlBuilder is a utility class in [warpcast.ts](https://github.com/iSpeakNerd/cast-intent/blob/main/warpcast.ts) has various methods to build URLs as described in the [cast intent docs](https://docs.farcaster.xyz/reference/warpcast/cast-composer-intents) for Warpcast. Methods come with input validation.

---

Using this repository: 

1. Install dependencies 
```bash
npm install
# or 
pnpm install
# or
yarn install
```

2. Import WarpcastUrlBuilder (or c/p warpcast.ts code)

```ts
import WarpcastUrlBuilder from './warpcast.ts'
```

3. Use class methods

```ts
// example
  const url = warpcastUrlBuilder.composerUrl({
    text: `Welcome new frens! If you played a game and got a /poap from me at /devcon love to hear from you in /tabletop! 
    
    Click Start to get your channel invite!`,
    embeds: ['https://poap-invites-frame.vercel.app/api'],
    channelKey: 'tabletop',
  });
// https://warpcast.com/~/compose?text=Welcome%2520new%2520frens%21%2520If%2520you%2520played%2520a%2520game%2520and%2520got%2520a%2520%252Fpoap%2520from%2520me%2520at%2520%252Fdevcon%2520love%2520to%2520hear%2520from%2520you%2520in%2520%252Ftabletop%21%2520%250A%2520%2520%2520%2520%250A%2520%2520%2520%2520Click%2520Start%2520to%2520get%2520your%2520channel%2520invite%21&embeds%5B%5D=https%3A%2F%2Fpoap-invites-frame.vercel.app%2Fapi&channelKey=tabletop
```
