<template>
  <div class="connection-topology" role="img" aria-label="MacのZig_80 CLIからUSBでRaspberry Pi Pico 2のUSB PIOブリッジへ接続。S10を介し300bpsでPC-8001の8251と通信する論理構成図。">
    <div class="connection-node"><b>Mac</b><span>Zig_80 CLI</span></div>
    <div class="connection-link">USB<br>↔</div>
    <div class="connection-node"><b>Raspberry Pi<br>Pico 2</b><span>USB/PIOブリッジ</span></div>
    <div class="connection-link">S10<br>↔<small>300bps</small></div>
    <div class="connection-node"><b>PC-8001</b><span>8251による<br>シリアル通信</span></div>
  </div>
</template>
<style scoped>
.connection-topology { display:grid; grid-template-columns:minmax(0,1fr) 95px minmax(0,1.4fr) 95px minmax(0,1fr); align-items:stretch; text-align:center; margin:75px 0 0; }
.connection-node { border-top:2px solid var(--green); padding:24px 3px; }
.connection-node b { display:flex; flex-direction:column; justify-content:center; min-height:90px; font-size:30px; line-height:1.5; }
.connection-node span { display:block; font-size:22px; color:var(--muted); margin-top:20px; line-height:1.7; }
.connection-link { align-self:center; font-size:25px; color:var(--green); line-height:1.8; }
.connection-link small { display:block; font-size:18px; }
</style>
