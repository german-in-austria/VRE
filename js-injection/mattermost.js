document.querySelector('body')
  .insertAdjacentHTML('beforeend',`
    <style>
      .app__body .sidebar--left .nav-pills__container li>a.unread-title{
        color: #333 !important;
      }
    </style>`
  )
