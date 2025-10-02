<template>
  <div class="NuxtLogo">
    <img 
      src="https://media.licdn.com/dms/image/v2/D560BAQFYw_1V4LwYFg/company-logo_200_200/company-logo_200_200/0/1685950507994/sobat_teknologi_indonesia_logo?e=2147483647&v=beta&t=dxiACDC3MTzdNPsHTONhwuAirUKECJ15uwRNhaWAcl8" 
      alt="Nuxt Logo"
    />
  </div>
</template>

<style>
.NuxtLogo {
  display: flex;
  justify-content: center;
  margin: auto;
  animation: appear 1s ease-in-out;
}

.NuxtLogo img {
  width: 200px;
  height: auto;
}

@keyframes appear {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
