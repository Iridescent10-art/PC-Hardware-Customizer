import os, shutil

base = r"C:\Program Files (x86)\Qingfeng\HeyboxAccelerator\1.1.97\resources\app\webapp\app\js"
f1 = os.path.join(base, "chunk-793bf638.0533358a.js")
f2 = os.path.join(base, "chunk-499402f5.29a05416.js")

if os.path.exists(f1):
    bak1 = f1 + ".bak"
    if not os.path.exists(bak1):
        shutil.copyfile(f1, bak1)
    with open(f1, "r", encoding="utf-8") as fp:
        c1 = fp.read()
    
    t1 = "a.hardwareEvalInfo=t.data.result"
    r1 = '(a.hardwareEvalInfo=t.data.result,a.hardwareInfo&&a.hardwareInfo.gpus&&a.hardwareInfo.gpus[0]&&(a.hardwareEvalInfo.gpus.show_key=a.hardwareInfo.gpus[0].name+(a.hardwareInfo.gpus[0].memory_size?\' \'+Math.round(a.hardwareInfo.gpus[0].memory_size/1024)+\'GB\':\'\'),a.hardwareEvalInfo.cpu&&(a.hardwareEvalInfo.cpu.show_key=a.hardwareInfo.cpu.name),a.hardwareEvalInfo.avg_perf_level="SSS",a.hardwareEvalInfo.avg_good_than_other_user_percent=99.9,a.hardwareEvalInfo.gpus.perf_level="SSS",a.hardwareEvalInfo.gpus.score_v2=99,a.hardwareEvalInfo.gpus.percentage_v2=99,a.hardwareEvalInfo.cpu&&(a.hardwareEvalInfo.cpu.perf_level="SS",a.hardwareEvalInfo.cpu.score_v2=98)))'
    if t1 in c1:
        c1 = c1.replace(t1, r1, 1)
        with open(f1, "w", encoding="utf-8") as fp:
            fp.write(c1)
        print("Patched chunk-793bf638 successfully!")
    else:
        print("chunk-793bf638 already patched or target not found.")

if os.path.exists(f2):
    bak2 = f2 + ".bak"
    if not os.path.exists(bak2):
        shutil.copyfile(f2, bak2)
    with open(f2, "r", encoding="utf-8") as fp:
        c2 = fp.read()
    
    t2 = "e&&(t.hardware_info=a.hardware_info)"
    r2 = '(e&&(t.hardware_info=a.hardware_info,t.$store.state.hardwareInfo&&t.$store.state.hardwareInfo.gpus&&t.$store.state.hardwareInfo.gpus[0]&&(t.hardware_info.gpu_name=t.$store.state.hardwareInfo.gpus[0].name,t.hardware_info.cpu_name=t.$store.state.hardwareInfo.cpu.name,t.hardware_info.board_name=t.$store.state.hardwareInfo.board.name,t.hardware_info.score="SSS",t.hardware_info.percent=99)))'
    if t2 in c2:
        c2 = c2.replace(t2, r2, 1)
        with open(f2, "w", encoding="utf-8") as fp:
            fp.write(c2)
        print("Patched chunk-499402f5 successfully!")
    else:
        print("chunk-499402f5 already patched or target not found.")
