<a href="javascript:void(0);" on:click={() => (showDialog = true)}>
  {linkText}
</a>

{#if showDialog}
  <div class="recovery-dialog-container layout-compact">
    <div
      class="recovery-dialog-overlay"
      on:click={() => (showDialog = false)}
    />
    {#if recovering}
      <div class="recovery-dialog loading">
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
          This will just take a second...
        </span>
      </div>
    {:else if successRecoveredMessage}
      <div class="recovery-dialog">
        <div>{successRecoveredMessage}</div>
        <div class="close-button-container">
          <button
            class="pf-button {classButton}"
            type="button"
            on:click={() => (showDialog = false)}
          >
            Close
          </button>
        </div>
      </div>
    {:else}
      <form onsubmit="return false;" class="recovery-dialog pf-form">
        <div class="pf-element pf-heading">
          <h2 class="recovery-dialog-title">Account Recovery</h2>
        </div>
        {#if !hasSentSecret}
          {#if !clientConfig.email_usernames}
            <div class="pf-element">
              <span class="pf-label">Recovery Type</span>
              <label>
                <input
                  class="pf-field {classRadio}"
                  bind:group={recoveryType}
                  type="radio"
                  name="type"
                  value="password"
                />
                I forgot my password.
              </label>
              <label>
                <input
                  class="pf-field {classRadio}"
                  bind:group={recoveryType}
                  type="radio"
                  name="type"
                  value="username"
                />
                I forgot my username.
              </label>
            </div>
          {/if}
          <div class="pf-element">
            {#if recoveryType === 'password'}
              <p>
                To reset your password, type the
                {clientConfig.email_usernames ? 'email' : 'username'}
                you use to sign in below.
              </p>
            {/if}
            {#if recoveryType === 'username'}
              <p>
                To get your username, type your email as you entered it when
                creating your account.
              </p>
            {/if}
          </div>
          <div class="pf-element">
            <label>
              {#if recoveryType === 'password'}
                <span class="pf-label">
                  {clientConfig.email_usernames ? 'Email Address' : 'Username'}
                </span>
              {/if}
              {#if recoveryType === 'username'}
                <span class="pf-label">Email Address</span>
              {/if}
              <input
                class="pf-field {classInput}"
                type="text"
                bind:this={accountElem}
                bind:value={account}
                size="24"
                autocapitalize="off"
                spellcheck="false"
              />
            </label>
          </div>
        {:else}
          <div class="pf-element">
            <p>
              A code has been sent to you by email. Enter that code here, and a
              new password for your account.
            </p>
          </div>
          <div class="pf-element">
            <label>
              <span class="pf-label">Recovery Code</span>
              <input
                class="pf-field {classInput}"
                bind:value={secret}
                type="text"
                size="24"
              />
            </label>
          </div>
          <div class="pf-element">
            <label>
              <span class="pf-label">Password</span>
              <input
                class="pf-field {classInput}"
                bind:value={password}
                type="password"
                autocomplete="new-password"
                size="24"
              />
            </label>
          </div>
          <div class="pf-element">
            <label>
              <span class="pf-label">Re-enter Password</span>
              <input
                class="pf-field {classInput}"
                bind:value={password2}
                type="password"
                autocomplete="new-password"
                size="24"
              />
            </label>
          </div>
        {/if}

        {#if failureMessage}
          <div class="pf-element pf-full-width">
            <span class="pf-group pf-full-width">
              <span class="pf-field" style="display: block;">
                {failureMessage}
              </span>
            </span>
          </div>
        {/if}

        <div class="pf-element pf-buttons">
          {#if !hasSentSecret}
            <button
              class="pf-button {classSubmit}"
              type="submit"
              on:click={sendRecoveryLink}
            >
              Send Recovery Link
            </button>
          {:else}
            <button
              class="pf-button {classSubmit}"
              type="submit"
              on:click={recover}
            >
              Reset Password
            </button>
          {/if}
          <button
            class="pf-button {classButton}"
            type="button"
            on:click={() => (showDialog = false)}
          >
            Close
          </button>
        </div>
      </form>
    {/if}
  </div>
{/if}

<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { User } from 'tilmeld-client';

  // The text used to toggle the dialog.
  export let linkText = "I can't access my account.";
  // Give focus to the account box when the form is ready.
  export let autofocus = true;
  export let recoveryType = 'password';
  export let classInput = '';
  export let classRadio = '';
  export let classSubmit = '';
  export let classButton = '';

  // These are all user provided details.
  export let account = '';
  export let secret = '';
  export let password = '';
  export let password2 = '';

  let clientConfig = {
    reg_fields: [],
    email_usernames: true,
    allow_registration: true,
    pw_recovery: true,
    timezones: [],
  };
  let showDialog = false;
  let recovering = false;
  let hasSentSecret = false;
  let accountElem;
  let failureMessage;
  let successRecoveredMessage;

  $: {
    if (showDialog && autofocus && accountElem) {
      accountElem.focus();
    }
  }

  onMount(() => {
    User.getClientConfig().then((config) => {
      clientConfig = config;
    });
  });

  function sendRecoveryLink() {
    if (account === '') {
      failureMessage =
        'You need to enter ' +
        (clientConfig.email_usernames || recoveryType === 'username'
          ? 'an email address'
          : 'a username') +
        '.';
      return;
    }

    failureMessage = null;
    recovering = true;
    User.sendRecoveryLink({
      recoveryType,
      account,
    }).then(
      (data) => {
        if (!data.result) {
          failureMessage = data.message;
        } else {
          if (recoveryType === 'username') {
            successRecoveredMessage = data.message;
          } else if (recoveryType === 'password') {
            hasSentSecret = true;
          }
        }
        recovering = false;
      },
      () => {
        failureMessage = 'An error occurred.';
        recovering = false;
      },
    );
  }

  function recover() {
    if (account === '') {
      failureMessage =
        'You need to enter ' +
        (clientConfig.email_usernames || recoveryType === 'username'
          ? 'an email address'
          : 'a username') +
        '.';
      return;
    }
    if (password !== password2) {
      failureMessage = 'Your passwords do not match.';
      return;
    }
    if (password === '') {
      failureMessage = 'You need to enter a password.';
      return;
    }

    failureMessage = null;
    recovering = true;
    User.recover({
      username: account,
      secret,
      password,
    }).then(
      (data) => {
        if (!data.result) {
          failureMessage = data.message;
        } else {
          successRecoveredMessage = data.message;
        }
        recovering = false;
      },
      () => {
        failureMessage = 'An error occurred.';
        recovering = false;
      },
    );
  }
</script>

<style>
  .recovery-dialog-container {
    display: flex;
    align-items: center;
  }
  .recovery-dialog-container.layout-compact {
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
  }
  .recovery-dialog-overlay {
    display: none;
  }
  .recovery-dialog-container.layout-compact .recovery-dialog-overlay {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
  .recovery-dialog {
    display: flex;
    flex-direction: column;
  }
  .recovery-dialog-container.layout-compact .recovery-dialog {
    padding: 2em;
    box-shadow: 0px 5px 36px 0px rgba(0, 0, 0, 0.25);
    background-color: #fff;
    max-height: 80vh;
    max-width: 80vw;
    overflow: auto;
    z-index: 2;
  }
  .recovery-dialog-container.layout-compact .recovery-dialog.loading {
    width: 90vw;
    height: 90vh;
    max-width: 260px;
    max-height: 100px;
    justify-content: center;
    align-items: center;
  }
  .recovery-dialog-title {
    padding-top: 0;
    margin-top: 0;
  }
  .close-button-container {
    text-align: right;
    margin-top: 1em;
  }
</style>
