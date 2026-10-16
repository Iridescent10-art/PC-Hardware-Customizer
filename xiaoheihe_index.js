// ====== Xiaoheihe Hardware Detection Hook ======
(function() {
  try {
    const fs = require('fs');
    const Module = require('module');

    function loadConfig() {
      const candidates = [
        'C:\\Users\\Public\\Hardware_Config.json',
        'D:\\AI\\自定义配置\\config.json'
      ];
      for (const p of candidates) {
        try {
          if (fs.existsSync(p)) {
            const raw = fs.readFileSync(p, 'utf8');
            const data = JSON.parse(raw);
            if (data && data.custom_target) return data.custom_target;
          }
        } catch (e) {}
      }
      return null;
    }

    function applyCustomConfig(info) {
      if (!info) return;
      try {
        const target = loadConfig();
        if (!target) return;
        
        // 1. GPU Hook
        if (Array.isArray(info.gpus) && info.gpus.length > 0) {
          if (target.gpu_model) info.gpus[0].name = target.gpu_model;
          if (target.gpu_vram_gb) info.gpus[0].memory_size = target.gpu_vram_gb * 1024;
        }
        
        // 2. CPU Hook
        if (info.cpu) {
          if (target.cpu_model) {
            info.cpu.name = target.cpu_model;
            const coreMatch = target.cpu_model.match(/(\d+)-Core/i);
            if (coreMatch) {
              info.cpu.cores = parseInt(coreMatch[1], 10);
            } else if (/9950|7950|14900|13900|285K/i.test(target.cpu_model)) {
              info.cpu.cores = 16;
            } else if (/9850|9800|7800|9700|14700|265K/i.test(target.cpu_model)) {
              info.cpu.cores = 8;
            } else if (/9600|7600|14600|245K/i.test(target.cpu_model)) {
              info.cpu.cores = 6;
            }
          }
        }

        // 3. Motherboard Hook (保留厂商完整前缀，如 ASUSTeK COMPUTER INC. ROG ...)
        if (info.board) {
          const v = (target.motherboard_vendor || info.board.vendor || '').trim();
          const p = (target.motherboard_product || info.board.product || '').trim();
          if (v) info.board.vendor = v;
          if (p) info.board.product = p;

          let fullBoard = p;
          if (v && !p.toLowerCase().startsWith(v.toLowerCase())) {
            fullBoard = `${v} ${p}`;
          }
          info.board.name = fullBoard;
        }
        if (info.computer) {
          const v = (target.motherboard_vendor || info.computer.vendor || '').trim();
          const p = (target.motherboard_product || info.computer.model || '').trim();
          if (v) info.computer.vendor = v;
          if (p) {
            let fullModel = p;
            if (v && !p.toLowerCase().startsWith(v.toLowerCase())) {
              fullModel = `${v} ${p}`;
            }
            info.computer.model = fullModel;
          }
        }

        // 4. Memory Hook
        if (info.memory) {
          if (target.memory_vendor) info.memory.vendor = target.memory_vendor;
          if (target.memory_size_gb) info.memory.memory_size = target.memory_size_gb * 1024;
          if (target.memory_clock_mhz) info.memory.clock_speed = target.memory_clock_mhz;
        }

        // 5. Disk Hook
        if (Array.isArray(info.disks) && info.disks.length > 0) {
          if (target.disk_model) info.disks[0].name = target.disk_model;
        }
      } catch (err) {}
    }

    const origNode = Module._extensions['.node'];
    Module._extensions['.node'] = function(module, filename) {
      origNode(module, filename);
      if (filename && filename.toLowerCase().includes('acc_hardware_helper.node')) {
        const origGet = module.exports.getHardwareInfo;
        if (typeof origGet === 'function') {
          module.exports.getHardwareInfo = function(cb) {
            origGet.call(this, function(info) {
              applyCustomConfig(info);
              if (typeof cb === 'function') cb(info);
            });
          };
        }
      }
    };
  } catch (e) {}
})();
// ===============================================

let args = process.argv.slice(1)
if (args.includes('--load_js')) {
  require('./src/main')
} else {
  require('./bytenode/loader/index')
  require('./source/main')
}
