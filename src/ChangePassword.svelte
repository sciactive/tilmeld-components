{#if user && user.guid}
  {#if layout === 'compact'}
    <a href="javascript:void(0);" on:click={() => (showDialog = true)}>
      {compactText}
    </a>
  {/if}

  {#if layout !== 'compact' || showDialog}
    <div class="change-password-dialog-container layout-{layout}">
      <div
        class="change-password-dialog-overlay"
        on:click={() => (showDialog = false)}
      />
      {#if changing}
        <div class="change-password-dialog loading">
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
            {#if changing}This will just take a second...{/if}
          </span>
        </div>
      {:else if successChangedMessage}
        <div class="change-password-dialog">
          <div>{successChangedMessage}</div>
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
      {:else}
        <form
          onsubmit="return false;"
          class="change-password-dialog pf-form {layout === 'small' ? 'pf-layout-block' : ''}"
        >
          {#if layout === 'compact'}
            <div class="pf-element pf-heading">
              <h2 class="change-password-dialog-title">{compactText}</h2>
            </div>
          {/if}
          <div class="pf-element">
            <label>
              <span class="pf-label">Old Password</span>
              <input
                class="pf-field {classInput}"
                bind:value={oldPassword}
                type="password"
                autocomplete="current-password"
                name="oldPassword"
                size="24"
              />
            </label>
          </div>
          <div class="pf-element">
            <label>
              <span class="pf-label">New Password</span>
              <input
                class="pf-field {classInput}"
                bind:value={password}
                type="password"
                autocomplete="new-password"
                name="password"
                size="24"
              />
            </label>
          </div>
          <div class="pf-element">
            <label>
              <span class="pf-label">Re-enter New Password</span>
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

          {#if failureMessage}
            <div class="pf-element pf-full-width">
              <span class="pf-group pf-full-width">
                <span class="pf-field" style="display: block;">
                  {failureMessage}
                </span>
              </span>
            </div>
          {/if}

          <div class="pf-element {layout === 'small' ? '' : 'pf-buttons'}">
            <button
              class="pf-button {classSubmit}"
              type="submit"
              on:click={changePassword}
            >
              Change Password
            </button>
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
        </form>
      {/if}
    </div>
  {/if}
{:else}You must be logged in to change your password.{/if}

<script>
  import { onMount, onDestroy } from 'svelte';
  import { User } from 'tilmeld-client';

  // 'normal', 'small', or 'compact'
  export let layout = 'normal';
  // The text used to toggle the dialog when 'compact' layout is selected.
  export let compactText = 'Change password';
  export let classInput = '';
  export let classSubmit = '';
  export let classButton = '';

  let user = null;
  let showDialog = false;
  let changing = false;
  let failureMessage = null;
  let successChangedMessage = null;

  // These are all user provided details.
  export let oldPassword = '';
  export let password = '';
  export let password2 = '';

  $: {
    if (!showDialog) {
      changing = false;
      failureMessage = null;
      successChangedMessage = null;
      oldPassword = '';
      password = '';
      password2 = '';
    }
  }

  const onLogin = currentUser => {
    user = currentUser;
  };
  const onLogout = () => {
    user = null;
  };

  onMount(() => {
    User.current().then(currentUser => {
      user = currentUser;
    });

    User.on('login', onLogin);
    User.on('logout', onLogout);
  });

  onDestroy(() => {
    User.off('login', onLogin);
    User.off('logout', onLogout);
  });

  function changePassword() {
    if (oldPassword === '') {
      failureMessage = 'You need to enter your current password';
      return;
    }
    if (password !== password2) {
      failureMessage = 'Your passwords do not match.';
      return;
    }
    if (password === '') {
      failureMessage = 'You need to enter a new password';
      return;
    }

    failureMessage = null;
    changing = true;
    // Get the current user again, in case their data has changed.
    User.current().then(currentUser => {
      user = currentUser;

      if (!currentUser || !currentUser.guid) {
        failureMessage = 'You must be logged in.';
        changing = false;
        return;
      }

      // Change the user's password.
      currentUser
        .$changePassword({
          oldPassword,
          password,
        })
        .then(
          data => {
            if (!data.result) {
              failureMessage = data.message;
            } else {
              successChangedMessage = data.message;
            }
            changing = false;
          },
          () => {
            failureMessage = 'An error occurred.';
            changing = false;
          },
        );
    });
  }
</script>

<style>
  .change-password-dialog-container {
    display: flex;
    align-items: center;
  }
  .change-password-dialog-container.layout-compact {
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
  }
  .change-password-dialog-overlay {
    display: none;
  }
  .change-password-dialog-container.layout-compact
    .change-password-dialog-overlay {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
  .change-password-dialog {
    display: flex;
    flex-direction: column;
  }
  .change-password-dialog-container.layout-compact .change-password-dialog {
    padding: 2em;
    box-shadow: 0px 5px 36px 0px rgba(0, 0, 0, 0.25);
    background-color: #fff;
    max-height: 80vh;
    max-width: 80vw;
    overflow: auto;
    z-index: 2;
  }
  .change-password-dialog-container.layout-compact
    .change-password-dialog.loading {
    width: 90vw;
    height: 90vh;
    max-width: 260px;
    max-height: 100px;
    justify-content: center;
    align-items: center;
  }
  .change-password-dialog-title {
    padding-top: 0;
    margin-top: 0;
  }
  .close-button-container {
    text-align: right;
    margin-top: 1em;
  }
</style>
