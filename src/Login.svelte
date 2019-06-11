{#if layout === 'compact'}
  {#if successLoginMessage}
    {successLoginMessage}
  {:else}
    <a href="javascript:void(0);" on:click={() => (showDialog = true)}>
      {compactText}
    </a>
  {/if}
{/if}
{#if layout !== 'compact' || showDialog}
  <div class="login-dialog-container layout-{layout}">
    <div class="login-dialog-overlay" on:click={() => (showDialog = false)} />
    {#if registering || loggingIn}
      <div class="login-dialog loading">
        <span>
          <svg
            style="display: inline;"
            width="16"
            height="16"
            viewBox="0 0 300 300"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
          >
            <path
              d="M 150,0 a 150,150 0 0,1 106.066,256.066 l -35.355,-35.355 a
              -100,-100 0 0,0 -70.711,-170.711 z"
              fill="#000000"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 150 150"
                to="360 150 150"
                begin="0s"
                dur="1s"
                fill="freeze"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          {#if registering}Registering...{/if}
          {#if loggingIn}Logging in...{/if}
        </span>
      </div>
    {:else if successRegisteredMessage}
      <div class="login-dialog">
        <div>{successRegisteredMessage}</div>
        {#if layout === 'compact'}
          <div class="close-button-container">
            <button
              class="pf-button {classButton}"
              type="button"
              on:click={() => (showDialog = false)}
            >
              Close
            </button>
          </div>
        {/if}
      </div>
    {:else if successLoginMessage}
      <div class="login-dialog">
        <div>{successLoginMessage}</div>
      </div>
    {:else}
      <form
        onsubmit="return false;"
        class="login-dialog pf-form {layout === 'small' ? 'pf-layout-block' : ''}"
      >
        {#if layout === 'compact' && showCompactHeading}
          <div class="pf-element pf-heading">
            <h2 class="login-dialog-title">{compactText}</h2>
          </div>
        {/if}
        {#if clientConfig.allow_registration && showExistingUserToggle}
          <div class="pf-element pf-full-width">
            <span class={classButtonGroup}>
              <button
                class="{classButton}
                {classButtonToggle}
                {existingUser ? classButtonActive : ''}"
                type="button"
                on:click={() => (existingUser = true)}
                disabled={existingUser && disableActiveButton}
                aria-pressed={existingUser}
              >
                Log In
              </button>
              <button
                class="{classButton}
                {classButtonToggle}
                {!existingUser ? classButtonActive : ''}"
                type="button"
                on:click={() => (existingUser = false)}
                disabled={!existingUser && disableActiveButton}
                aria-pressed={!existingUser}
              >
                Sign Up
              </button>
            </span>
          </div>
        {/if}

        <div class="pf-element">
          <label>
            <span class="pf-label">
              {clientConfig.email_usernames ? 'Email' : 'Username'}
            </span>
            <span
              class={layout !== 'small' ? 'pf-group' : ''}
              style="display: {layout !== 'small' ? 'block' : 'in-line'};"
            >
              {#if clientConfig.email_usernames}
                <input
                  class="pf-field {classInput}"
                  bind:value={username}
                  bind:this={usernameElem}
                  type="email"
                  autocomplete="email"
                  name="email"
                  size="24"
                  autocapitalize="off"
                  spellcheck="false"
                />
              {:else}
                <input
                  class="pf-field {classInput}"
                  bind:value={username}
                  bind:this={usernameElem}
                  type="text"
                  autocomplete="username"
                  name="username"
                  size="24"
                  autocapitalize="off"
                  spellcheck="false"
                />
              {/if}
              {#if !existingUser}
                {#if layout === 'small' || layout === 'compact'}
                  <br class="pf-clearing" />
                {/if}
                {#if usernameVerifiedMessage}
                  <span class="pf-field">{usernameVerifiedMessage}</span>
                {/if}
              {/if}
            </span>
          </label>
        </div>
        <div class="pf-element">
          <label>
            <span class="pf-label">Password</span>
            <input
              class="pf-field {classInput}"
              bind:value={password}
              type="password"
              autocomplete="{clientConfig.allow_registration && !existingUser ? 'new' : 'current'}-password"
              name="password"
              size="24"
            />
          </label>
        </div>
        {#if clientConfig.allow_registration && !existingUser}
          <div class="pf-element">
            <label>
              <span class="pf-label">Re-enter Password</span>
              <input
                class="pf-field {classInput}"
                bind:value={password2}
                type="password"
                autocomplete="new-password"
                name="password2"
                size="24"
              />
            </label>
          </div>
          {#if clientConfig.reg_fields.indexOf('name') !== -1}
            <div class="pf-element">
              <label>
                <span class="pf-label">Name</span>
                <input
                  class="pf-field {classInput}"
                  bind:value={name}
                  type="text"
                  autocomplete="name"
                  name="name"
                  size="24"
                />
              </label>
            </div>
          {/if}
          {#if !clientConfig.email_usernames && clientConfig.reg_fields.indexOf('email') !== -1}
            <div class="pf-element">
              <label>
                <span class="pf-label">Email</span>
                <input
                  class="pf-field {classInput}"
                  bind:value={email}
                  type="email"
                  autocomplete="email"
                  name="email"
                  size="24"
                  autocapitalize="off"
                  spellcheck="false"
                />
              </label>
            </div>
          {/if}
          {#if clientConfig.reg_fields.indexOf('phone') !== -1}
            <div class="pf-element">
              <label>
                <span class="pf-label">Phone Number</span>
                <input
                  class="pf-field {classInput}"
                  bind:value={phone}
                  type="tel"
                  autocomplete="tel"
                  name="phone"
                  size="24"
                />
              </label>
            </div>
          {/if}
          {#if clientConfig.reg_fields.indexOf('timezone') !== -1}
            <div class="pf-element {layout === 'small' ? 'pf-full-width' : ''}">
              <label>
                <span class="pf-label">Timezone</span>
                <span class="pf-note">
                  This overrides the primary group&apos;s timezone.
                </span>
                <span
                  class={layout === 'compact' ? 'pf-group' : ''}
                  style="display: {layout === 'compact' ? 'block' : 'in-line'};"
                >
                  <select
                    class="pf-field"
                    bind:value={timezone}
                    name="timezone"
                    style={layout === 'small' ? 'max-width: 95%;' : ''}
                  >
                    <option value="">--Default--</option>
                    {#each clientConfig.timezones as tz}
                      <option value={tz}>{tz}</option>
                    {/each}
                  </select>
                </span>
              </label>
            </div>
          {/if}
          {#if clientConfig.reg_fields.indexOf('address') !== -1}
            <div class="pf-element">
              <span class="pf-label">Address Type</span>
              <label>
                <input
                  class="pf-field {classRadio}"
                  bind:group={addressType}
                  type="radio"
                  name="addressType"
                  value="us"
                />
                US
              </label>
              <label>
                <input
                  class="pf-field {classRadio}"
                  bind:group={addressType}
                  type="radio"
                  name="addressType"
                  value="international"
                />
                International
              </label>
            </div>
            {#if addressType === 'us'}
              <div class="pf-element">
                <label>
                  <span class="pf-label">Address 1</span>
                  <input
                    class="pf-field {classInput}"
                    bind:value={addressStreet}
                    type="text"
                    autocomplete="address-line1"
                    name="street"
                    size="24"
                  />
                </label>
              </div>
              <div class="pf-element">
                <label>
                  <span class="pf-label">Address 2</span>
                  <input
                    class="pf-field {classInput}"
                    bind:value={addressStreet2}
                    type="text"
                    autocomplete="address-line2"
                    name="street2"
                    size="24"
                  />
                </label>
              </div>
              <div
                class="pf-element {layout === 'small' ? 'pf-full-width' : ''}"
              >
                <span class="pf-label">City, State</span>
                <span
                  class={layout === 'compact' ? 'pf-group' : ''}
                  style={layout === 'compact' ? 'white-space: nowrap; margin-right: 16px; display: block;' : 'display: in-line;'}
                >
                  <input
                    class="pf-field {classInput}"
                    bind:value={addressCity}
                    autocomplete="address-level2"
                    type="text"
                    name="city"
                    size={layout === 'small' ? '10' : '15'}
                  />
                  <select
                    class="pf-field {classSelect}"
                    bind:value={addressState}
                    name="state"
                    style={layout === 'small' ? 'max-width: 95%;' : ''}
                  >
                    {#each states as state}
                      <option value={state[0]}>{state[1]}</option>
                    {/each}
                  </select>
                </span>
              </div>
              <div class="pf-element">
                <label>
                  <span class="pf-label">Zip</span>
                  <input
                    class="pf-field {classInput}"
                    bind:value={addressZip}
                    type="text"
                    autocomplete="postal-code"
                    name="zip"
                    size="24"
                  />
                </label>
              </div>
            {:else}
              <div class="pf-element pf-full-width">
                <label>
                  <span class="pf-label">Address</span>
                  <span class="pf-group pf-full-width">
                    <span class="pf-field" style="display: block;">
                      <textarea
                        class={classTextarea}
                        style="width: 100%;"
                        rows="3"
                        cols="35"
                        bind:value={addressInternational}
                        name="address"
                      />
                    </span>
                  </span>
                </label>
              </div>
            {/if}
          {/if}
        {/if}
        {#if failureMessage}
          <div class="pf-element pf-full-width">
            <span class="pf-group pf-full-width">
              <span
                class="pf-field"
                style="display: block; white-space: pre-line;"
              >
                {failureMessage}
              </span>
            </span>
          </div>
        {/if}

        <div class="pf-element {layout === 'small' ? '' : 'pf-buttons'}">
          {#if existingUser}
            <button
              class="pf-button {classSubmit}"
              type="submit"
              on:click={login}
            >
              Log In
            </button>
          {:else}
            <button
              class="pf-button {classSubmit}"
              type="submit"
              on:click={register}
            >
              Create Account
            </button>
          {/if}
          {#if layout === 'compact'}
            <button
              class="pf-button {classButton}"
              type="button"
              on:click={() => (showDialog = false)}
            >
              Close
            </button>
          {/if}
        </div>

        {#if !hideRecovery && clientConfig.pw_recovery && existingUser}
          <div class="pf-element pf-full-width">
            <span class="pf-group pf-full-width">
              <span class="pf-field" style="display: block;">
                <Recover
                  account={username}
                  {classInput}
                  {classRadio}
                  {classSubmit}
                  {classButton}
                />
              </span>
            </span>
          </div>
        {/if}
      </form>
    {/if}
  </div>
{/if}

<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { User } from 'tilmeld-client';
  import Recover from './Recover';

  const dispatch = createEventDispatcher();

  // 'normal', 'small', or 'compact'
  export let layout = 'normal';
  // Whether to show a heading in the dialog when in 'compact' layout.
  export let showCompactHeading = false;
  // The text used to toggle the dialog when 'compact' layout is selected.
  export let compactText = 'Log in/Sign up';
  // Hide the recovery link that only appears if password recovery is on.
  export let hideRecovery = false;
  // Give focus to the username box (or email box) when the form is ready.
  export let autofocus = true;
  // This determines whether the 'Log In' or 'Sign Up' button is activated and which corresponding form is shown.
  export let existingUser = true;
  // Whether to show the 'Log In'/'Sign Up' switcher buttons.
  export let showExistingUserToggle = true;
  // The states available when address type is US.
  export let states = [
    ['AL', 'Alabama'],
    ['AK', 'Alaska'],
    ['AZ', 'Arizona'],
    ['AR', 'Arkansas'],
    ['CA', 'California'],
    ['CO', 'Colorado'],
    ['CT', 'Connecticut'],
    ['DE', 'Delaware'],
    ['DC', 'DC'],
    ['FL', 'Florida'],
    ['GA', 'Georgia'],
    ['HI', 'Hawaii'],
    ['ID', 'Idaho'],
    ['IL', 'Illinois'],
    ['IN', 'Indiana'],
    ['IA', 'Iowa'],
    ['KS', 'Kansas'],
    ['KY', 'Kentucky'],
    ['LA', 'Louisiana'],
    ['ME', 'Maine'],
    ['MD', 'Maryland'],
    ['MA', 'Massachusetts'],
    ['MI', 'Michigan'],
    ['MN', 'Minnesota'],
    ['MS', 'Mississippi'],
    ['MO', 'Missouri'],
    ['MT', 'Montana'],
    ['NE', 'Nebraska'],
    ['NV', 'Nevada'],
    ['NH', 'New Hampshire'],
    ['NJ', 'New Jersey'],
    ['NM', 'New Mexico'],
    ['NY', 'New York'],
    ['NC', 'North Carolina'],
    ['ND', 'North Dakota'],
    ['OH', 'Ohio'],
    ['OK', 'Oklahoma'],
    ['OR', 'Oregon'],
    ['PA', 'Pennsylvania'],
    ['RI', 'Rhode Island'],
    ['SC', 'South Carolina'],
    ['SD', 'South Dakota'],
    ['TN', 'Tennessee'],
    ['TX', 'Texas'],
    ['UT', 'Utah'],
    ['VT', 'Vermont'],
    ['VA', 'Virginia'],
    ['WA', 'Washington'],
    ['WV', 'West Virginia'],
    ['WI', 'Wisconsin'],
    ['WY', 'Wyoming'],
    ['AA', 'Armed Forces (AA)'],
    ['AE', 'Armed Forces (AE)'],
    ['AP', 'Armed Forces (AP)'],
  ];
  export let classInput = '';
  export let classRadio = '';
  export let classSelect = '';
  export let classTextarea = '';
  export let classSubmit = '';
  export let classButtonGroup = 'button-group';
  export let classButton = '';
  export let classButtonToggle = '';
  export let classButtonActive = '';
  export let disableActiveButton = true;

  // These are all user provided details.
  export let username = '';
  export let password = '';
  export let password2 = '';
  export let name = '';
  export let email = '';
  export let phone = '';
  export let timezone = '';
  export let addressType = 'us';
  export let addressStreet = '';
  export let addressStreet2 = '';
  export let addressCity = '';
  export let addressState = 'AL';
  export let addressZip = '';
  export let addressInternational = '';

  let clientConfig = {
    reg_fields: [],
    email_usernames: true,
    allow_registration: true,
    pw_recovery: true,
    timezones: [],
  };
  let showDialog = false;
  let registering = false;
  let usernameElem;
  let successLoginMessage;
  let successRegisteredMessage;
  let failureMessage;
  let usernameTimer;
  let usernameVerified;
  let usernameVerifiedMessage;
  let loggingIn;

  $: nameFirst = name.match(/^(.*?)(?: ([^ ]+))?$/)[1] || '';
  $: nameLast = name.match(/^(.*?)(?: ([^ ]+))?$/)[2] || '';

  let _previousExistingUser;
  $: {
    if (existingUser !== _previousExistingUser) {
      checkUsername(username);
      _previousExistingUser = existingUser;
    }
  }

  $: {
    checkUsername(username);
  }

  onMount(() => {
    User.getClientConfig().then(config => {
      clientConfig = config;
      if (!clientConfig.allow_registration) {
        existingUser = true;
      }
      if (autofocus && usernameElem) {
        usernameElem.focus();
      }
    });
  });

  function login() {
    if (username === '') {
      failureMessage = 'You need to enter a username.';
      return;
    }
    if (password === '') {
      failureMessage = 'You need to enter a password';
      return;
    }

    failureMessage = null;
    loggingIn = true;
    User.loginUser({
      username,
      password,
    }).then(
      data => {
        if (!data.result) {
          failureMessage = data.message;
        } else {
          successLoginMessage = data.message;
          showDialog = false;
          dispatch('login', { user: data.user });
        }
        loggingIn = false;
      },
      () => {
        failureMessage = 'An error occurred.';
        loggingIn = false;
      },
    );
  }

  function register() {
    if (username === '') {
      failureMessage = 'You need to enter a username.';
      return;
    }
    if (!usernameVerified) {
      failureMessage = 'The username you entered is not valid.';
      return;
    }
    if (password !== password2) {
      failureMessage = 'Your passwords do not match.';
      return;
    }
    if (password === '') {
      failureMessage = 'You need to enter a password';
      return;
    }

    // Create a new user.
    let user = new User();
    user.username = username;
    if (clientConfig.email_usernames) {
      user.email = username;
    } else if (clientConfig.reg_fields.indexOf('email') !== -1) {
      user.email = email;
    }
    if (clientConfig.reg_fields.indexOf('name') !== -1) {
      user.nameFirst = nameFirst;
      user.nameLast = nameLast;
    }
    if (clientConfig.reg_fields.indexOf('phone') !== -1) {
      user.phone = phone;
    }
    if (clientConfig.reg_fields.indexOf('timezone') !== -1) {
      user.timezone = timezone;
    }
    if (clientConfig.reg_fields.indexOf('address') !== -1) {
      user.addressType = addressType;
      user.addressStreet = addressStreet;
      user.addressStreet2 = addressStreet2;
      user.addressCity = addressCity;
      user.addressState = addressState;
      user.addressZip = addressZip;
      user.addressInternational = addressInternational;
    }

    failureMessage = null;
    registering = true;
    user.$register({ password }).then(
      data => {
        if (!data.result) {
          failureMessage = data.message;
        } else {
          successRegisteredMessage = data.message;
          dispatch('register', user);
        }
        if (data.loggedin) {
          successLoginMessage = data.message;
          showDialog = false;
          dispatch('login', user);
        }
        registering = false;
      },
      err => {
        failureMessage =
          err.exception === 'Tilmeld\\Exceptions\\BadDataException'
            ? err.message
            : 'An error occurred.';
        registering = false;
      },
    );
  }

  function checkUsername(newValue) {
    usernameVerified = null;
    usernameVerifiedMessage = null;
    if (usernameTimer) {
      clearTimeout(usernameTimer);
      usernameTimer = null;
    }
    if (newValue === '' || existingUser) {
      return;
    }
    usernameTimer = setTimeout(() => {
      let user = new User();
      user.username = newValue;
      if (clientConfig.email_usernames) {
        user.email = newValue;
      }
      user.$checkUsername().then(
        data => {
          usernameVerified = data.result;
          usernameVerifiedMessage = data.result ? '' : data.message;
        },
        () => {
          usernameVerified = false;
          usernameVerifiedMessage = 'Error checking username.';
        },
      );
    }, 400);
  }
</script>

<style>
  .login-dialog-container {
    display: flex;
    align-items: center;
  }
  .login-dialog-container.layout-compact {
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
  }
  .login-dialog-overlay {
    display: none;
  }
  .login-dialog-container.layout-compact .login-dialog-overlay {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
  .login-dialog {
    display: flex;
    flex-direction: column;
  }
  .login-dialog-container.layout-compact .login-dialog {
    padding: 2em;
    box-shadow: 0px 5px 36px 0px rgba(0, 0, 0, 0.25);
    background-color: #fff;
    max-height: 80vh;
    max-width: 80vw;
    overflow: auto;
    z-index: 2;
  }
  .login-dialog-container.layout-compact .login-dialog.loading {
    width: 90vw;
    height: 90vh;
    max-width: 260px;
    max-height: 100px;
    justify-content: center;
    align-items: center;
  }
  .login-dialog-title {
    padding-top: 0;
    margin-top: 0;
  }
  .close-button-container {
    text-align: right;
    margin-top: 1em;
  }
  .login-dialog-container :global(.button-group) {
    display: block;
    text-align: center;
  }
</style>
