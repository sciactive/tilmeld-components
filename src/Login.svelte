<div class="login-form-container layout-{layout}">
  {#if registering || loggingIn}
    <div class="login-form loading">
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
    <div class="login-form">
      <div>{successRegisteredMessage}</div>
    </div>
  {:else if successLoginMessage}
    <div class="login-form">
      <div>{successLoginMessage}</div>
    </div>
  {:else}
    <form
      onsubmit="return false;"
      class="login-form pf-form {layout === 'small' ? 'pf-layout-block' : ''}"
    >
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
                style="display: in-line;"
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

<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Recover from './Recover.svelte';
  import { getClientConfig, login as loginAction, register as registerAction, checkUsername as checkUsernameAction } from './Actions.js';

  const dispatch = createEventDispatcher();

  // 'normal', 'small'
  export let layout = 'normal';
  // Hide the recovery link that only appears if password recovery is on.
  export let hideRecovery = false;
  // Give focus to the username box (or email box) when the form is ready.
  export let autofocus = true;
  // This determines whether the 'Log In' or 'Sign Up' button is activated and which corresponding form is shown.
  export let existingUser = true;
  // Whether to show the 'Log In'/'Sign Up' switcher buttons.
  export let showExistingUserToggle = true;
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

  let clientConfig = {
    reg_fields: [],
    email_usernames: true,
    allow_registration: true,
    pw_recovery: true,
    timezones: [],
  };
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

  let _previousExistingUser = existingUser;
  $: if (existingUser !== _previousExistingUser) {
    failureMessage = '';
    checkUsername(username);
    _previousExistingUser = existingUser;
  }

  $: {
    checkUsername(username);
  }

  onMount(() => {
    getClientConfig().then(config => {
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
    successLoginMessage = null;
    failureMessage = null;
    loggingIn = true;
    loginAction(username, password).then(data => {
      successLoginMessage = data.message;
      dispatch('login', { user: data.user });
    }, e => {
      failureMessage = e;
    }).finally(() => {
      loggingIn = false;
    });
  }

  function register() {
    successRegisteredMessage = null;
    successLoginMessage = null;
    failureMessage = null;
    registering = true;
    registerAction({
      username,
      usernameVerified,
      password,
      password2,
      email,
      nameFirst,
      nameLast,
      phone,
      timezone
    }).then(data => {
      successRegisteredMessage = data.message;
      dispatch('register', { user: data.user });
      if (data.loggedin) {
        successLoginMessage = data.message;
        dispatch('login', { user: data.user });
      }
    }, e => {
      failureMessage = e;
    }).finally(() => {
      registering = false;
    });
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
      checkUsernameAction(newValue).then(data => {
        usernameVerified = data.result;
        usernameVerifiedMessage = data.message;
      });
    }, 400);
  }
</script>

<style>
  .login-form-container {
    display: flex;
    align-items: center;
  }
  .login-form {
    display: flex;
    flex-direction: column;
  }
  .login-form-container :global(.button-group) {
    display: block;
    text-align: center;
  }
</style>
