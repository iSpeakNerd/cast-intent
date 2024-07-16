function buildCast() {
  let cast = {
    text: '',
    channel: '',
    hash: '',
    embeds: [],
    url: '',
  };
  const baseUrl = 'https://warpcast.com/~/compose';

  const embedsInput = [
    'https://warpcast.com/ispeaknerd.eth/0xfc15fd3e',
    'https://events.xyz/events/31c474',
  ]; // replace with user input
  const castTextInput =
    'hello fam! @ispeaknerd.eth was great to play games with you 🎲'; // replace with user input
  const channelInput = 'testinprod'; // replace with user input
  const hashInput = '0xfc15fd3e989e384d406668dbdd58df08b3162d3c'; // replace with user input, must be full hash

  const hashPattern = /^0x[a-fA-F0-9]{40}$/; // regex pattern for hash validation
  const urlPattern =
    /^(?:(?:https|http)\:\/\/|)(?:\w+|\.|\/|\-|\@|\?|\=|\#|\:|\%)+$/g; // regex pattern for URL validation
  console.log(`first embed = ${embedsInput[0]}`);
  console.log(urlPattern.test(embedsInput[0]));
  console.log(`second embed = ${embedsInput[1]}`);
  console.log(urlPattern.test(embedsInput[1]));

  //   const valid = urlPattern.test(embedsInput[0]) && urlPattern.test(embedsInput[1]);
  //   console.log(valid); // check if both URLs are valid

  const isValidEmbeds =
    urlPattern.test(embedsInput[0]) && urlPattern.test(embedsInput[1])
      ? true
      : false;
  if (!isValidEmbeds) {
    console.error('Error: Invalid URLs for embeds');
    return null;
  } else {
    console.log('Valid embeds');
    cast.embeds = embedsInput; // expected output: https://warpcast.com/ispeaknerd.eth/0xfc15fd3e
  }

  cast.text = encodeURI(castTextInput); // expected output: hello%20fam!%20%40ispeaknerd.eth%20was%20great%20to%20play%20games%20with%20you%20%F0%9F%8E%B2
  cast.channel = channelInput; // replace with user input
  const isValidHash =
    hashInput.length === 42 && hashPattern.test(hashInput) ? true : false;
  if (isValidHash) {
    console.log('Valid hash length + format');
    cast.hash = hashInput; // replace with user input // expected output: 0xfc15fd3e
  } else if (hashInput.length !== 42) {
    console.error('Error: Invalid hash length');
    // neynar API call to get valid hash
    return null;
  } else if (!hashPattern.test(hashInput)) {
    console.error('Error: Invalid hash format');
    return null;
  }

  cast.url =
    baseUrl +
    `?text=${cast.text}&channelKey=${cast.channel}&parentCastHash=${cast.hash}&embeds[]=${cast.embeds[0]}&embeds[]=${cast.embeds[1]}`; // build intent URL

  //   console.log(cast); // check output
  //   console.log(JSON.stringify(cast)); // check output

  return JSON.stringify(cast);
}

buildCast();
